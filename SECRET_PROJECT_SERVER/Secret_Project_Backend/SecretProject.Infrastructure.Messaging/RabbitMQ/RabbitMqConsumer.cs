using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;
using System.Text;
using System.Text.Json;

namespace SecretProject.Infrastructure.Messaging.RabbitMQ;

public sealed class RabbitMqConsumer(
    IOptions<RabbitMqOptions> options,
    RabbitMqConsumerSettings settings,
    IServiceScopeFactory scopeFactory,
    ILogger<RabbitMqConsumer> logger) : BackgroundService
{
    private readonly RabbitMqOptions _options = options.Value;
    private readonly Dictionary<string, RabbitMqSubscription> _subscriptions = settings.Subscriptions
        .ToDictionary(x => x.EventType, StringComparer.OrdinalIgnoreCase);

    private const string RetryCountHeader = "x-retry-count";
    private const string OriginalQueueHeader = "x-original-queue";
    private const string LastErrorHeader = "x-last-error";
    private const string FinalErrorHeader = "x-final-error";

    private IConnection? _connection;
    private IChannel? _channel;

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        if (_subscriptions.Count == 0)
        {
            logger.LogWarning("RabbitMQ consumer queue {QueueName} has no subscriptions", settings.QueueName);
            return;
        }

        var factory = new ConnectionFactory
        {
            HostName = _options.Host,
            Port = _options.Port,
            UserName = _options.Username,
            Password = _options.Password,
            VirtualHost = _options.VirtualHost,
            AutomaticRecoveryEnabled = true,
            TopologyRecoveryEnabled = true
        };

        _connection = await factory.CreateConnectionAsync(stoppingToken);
        _channel = await _connection.CreateChannelAsync(cancellationToken: stoppingToken);

        var retryQueueName = $"{settings.QueueName}.retry";
        var deadLetterQueueName = $"{settings.QueueName}.dlq";
        var deadLetterRoutingKey = $"{settings.QueueName}.dlq";

        await _channel.ExchangeDeclareAsync(
            _options.Exchange,
            ExchangeType.Topic,
            durable: true,
            autoDelete: false,
            cancellationToken: stoppingToken);

        await _channel.QueueDeclareAsync(
            settings.QueueName,
            durable: true,
            exclusive: false,
            autoDelete: false,
            cancellationToken: stoppingToken);

        await _channel.ExchangeDeclareAsync(
            _options.RetryExchange,
            ExchangeType.Topic,
            durable: true,
            autoDelete: false,
            cancellationToken: stoppingToken);

        await _channel.QueueDeclareAsync(
            retryQueueName,
            durable: true,
            exclusive: false,
            autoDelete: false,
            arguments: new Dictionary<string, object?>
            {
                ["x-message-ttl"] = (int)settings.RetryDelay.TotalMilliseconds,
                ["x-dead-letter-exchange"] = _options.Exchange
            },
            cancellationToken: stoppingToken);

        await _channel.ExchangeDeclareAsync(
            _options.DeadLetterExchange,
            ExchangeType.Direct,
            durable: true,
            autoDelete: false,
            cancellationToken: stoppingToken);

        await _channel.QueueDeclareAsync(
            deadLetterQueueName,
            durable: true,
            exclusive: false,
            autoDelete: false,
            cancellationToken: stoppingToken);

        await _channel.QueueBindAsync(
            deadLetterQueueName,
            _options.DeadLetterExchange,
            deadLetterRoutingKey,
            cancellationToken: stoppingToken);

        foreach (var subscription in _subscriptions.Values)
        {
            await _channel.QueueBindAsync(
                settings.QueueName,
                _options.Exchange,
                subscription.EventType,
                cancellationToken: stoppingToken);

            await _channel.QueueBindAsync(
                retryQueueName,
                _options.RetryExchange,
                subscription.EventType,
                cancellationToken: stoppingToken);
        }

        await _channel.BasicQosAsync(0, 1, false, stoppingToken);

        var consumer = new AsyncEventingBasicConsumer(_channel);
        consumer.ReceivedAsync += (_, args) => ConsumeAsync(args, stoppingToken);

        await _channel.BasicConsumeAsync(
            queue: settings.QueueName,
            autoAck: false,
            consumer: consumer,
            cancellationToken: stoppingToken);
    }

    private async Task ConsumeAsync(BasicDeliverEventArgs args, CancellationToken cancellationToken)
    {
        try
        {
            var json = Encoding.UTF8.GetString(args.Body.ToArray());
            var eventType = ResolveEventType(args, json);

            if (!_subscriptions.TryGetValue(eventType, out var subscription))
            {
                logger.LogWarning(
                    "RabbitMQ message with event type {EventType} has no handler in queue {QueueName}",
                    eventType,
                    settings.QueueName);

                await _channel!.BasicAckAsync(args.DeliveryTag, multiple: false, cancellationToken);
                return;
            }

            using var scope = scopeFactory.CreateScope();
            await subscription.HandleAsync(scope.ServiceProvider, json, cancellationToken);

            await _channel!.BasicAckAsync(args.DeliveryTag, multiple: false, cancellationToken);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Failed to consume RabbitMQ message from queue {QueueName}", settings.QueueName);

            if (_channel is not null)
            {
                await HandleFailureAsync(args, ex, cancellationToken);
            }
        }
    }

    private async Task HandleFailureAsync(
        BasicDeliverEventArgs args,
        Exception exception,
        CancellationToken cancellationToken)
    {
        var json = Encoding.UTF8.GetString(args.Body.ToArray());
        var retryCount = GetRetryCount(args);

        string eventType;
        try
        {
            eventType = ResolveEventType(args, json);
        }
        catch (Exception resolveException)
        {
            logger.LogError(
                resolveException,
                "RabbitMQ message from queue {QueueName} has no resolvable event type and will be moved to DLQ",
                settings.QueueName);

            await PublishDeadLetterAsync("unknown", json, retryCount, resolveException, cancellationToken);
            await _channel!.BasicAckAsync(args.DeliveryTag, multiple: false, cancellationToken);
            return;
        }

        if (retryCount < settings.MaxRetryAttempts)
        {
            await PublishRetryAsync(eventType, json, retryCount + 1, exception, cancellationToken);
        }
        else
        {
            await PublishDeadLetterAsync(eventType, json, retryCount, exception, cancellationToken);
        }

        await _channel!.BasicAckAsync(args.DeliveryTag, multiple: false, cancellationToken);
    }

    private async Task PublishRetryAsync(
        string eventType,
        string json,
        int retryCount,
        Exception exception,
        CancellationToken cancellationToken)
    {
        var properties = CreateFailureProperties(
            eventType,
            retryCount,
            settings.QueueName,
            LastErrorHeader,
            exception.Message);

        await _channel!.BasicPublishAsync(
            exchange: _options.RetryExchange,
            routingKey: eventType,
            mandatory: false,
            basicProperties: properties,
            body: Encoding.UTF8.GetBytes(json),
            cancellationToken: cancellationToken);

        logger.LogWarning(
            "RabbitMQ message {EventType} from queue {QueueName} scheduled for retry {RetryCount}/{MaxRetryAttempts}",
            eventType,
            settings.QueueName,
            retryCount,
            settings.MaxRetryAttempts);
    }

    private async Task PublishDeadLetterAsync(
        string eventType,
        string json,
        int retryCount,
        Exception exception,
        CancellationToken cancellationToken)
    {
        var properties = CreateFailureProperties(
            eventType,
            retryCount,
            settings.QueueName,
            FinalErrorHeader,
            exception.Message);

        await _channel!.BasicPublishAsync(
            exchange: _options.DeadLetterExchange,
            routingKey: $"{settings.QueueName}.dlq",
            mandatory: false,
            basicProperties: properties,
            body: Encoding.UTF8.GetBytes(json),
            cancellationToken: cancellationToken);

        logger.LogError(
            exception,
            "RabbitMQ message {EventType} from queue {QueueName} moved to DLQ after {RetryCount} retries",
            eventType,
            settings.QueueName,
            retryCount);
    }

    private static BasicProperties CreateFailureProperties(
        string eventType,
        int retryCount,
        string originalQueue,
        string errorHeader,
        string errorMessage)
    {
        return new BasicProperties
        {
            Persistent = true,
            ContentType = "application/json",
            Type = eventType,
            Headers = new Dictionary<string, object?>
            {
                [RetryCountHeader] = retryCount,
                [OriginalQueueHeader] = originalQueue,
                [errorHeader] = errorMessage
            }
        };
    }

    private static int GetRetryCount(BasicDeliverEventArgs args)
    {
        if (args.BasicProperties?.Headers is null ||
            !args.BasicProperties.Headers.TryGetValue(RetryCountHeader, out var value))
        {
            return 0;
        }

        return value switch
        {
            int intValue => intValue,
            long longValue => (int)longValue,
            byte[] bytes when int.TryParse(Encoding.UTF8.GetString(bytes), out var parsed) => parsed,
            _ => 0
        };
    }

    private static string ResolveEventType(BasicDeliverEventArgs args, string json)
    {
        if (!string.IsNullOrWhiteSpace(args.BasicProperties?.Type))
        {
            return args.BasicProperties.Type;
        }

        using var document = JsonDocument.Parse(json);
        if (document.RootElement.TryGetProperty("eventType", out var eventType) ||
            document.RootElement.TryGetProperty("EventType", out eventType))
        {
            return eventType.GetString()
                ?? throw new InvalidOperationException("RabbitMQ message event type is empty");
        }

        throw new InvalidOperationException("RabbitMQ message does not contain event type");
    }

    public override async Task StopAsync(CancellationToken cancellationToken)
    {
        if (_channel is not null)
        {
            await _channel.DisposeAsync();
            _channel = null;
        }

        if (_connection is not null)
        {
            await _connection.DisposeAsync();
            _connection = null;
        }

        await base.StopAsync(cancellationToken);
    }
}

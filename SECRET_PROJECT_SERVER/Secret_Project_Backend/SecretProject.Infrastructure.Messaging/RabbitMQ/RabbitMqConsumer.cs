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

        foreach (var subscription in _subscriptions.Values)
        {
            await _channel.QueueBindAsync(
                settings.QueueName,
                _options.Exchange,
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
                await _channel.BasicNackAsync(
                    args.DeliveryTag,
                    multiple: false,
                    requeue: false,
                    cancellationToken: cancellationToken);
            }
        }
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

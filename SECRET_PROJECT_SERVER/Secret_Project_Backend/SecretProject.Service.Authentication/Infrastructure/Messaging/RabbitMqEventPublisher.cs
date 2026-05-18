using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using RabbitMQ.Client;
using SecretProject.Service.Authentication.Configuration;
using System.Text;

namespace SecretProject.Service.Authentication.Infrastructure.Messaging
{
    public sealed class RabbitMqEventPublisher(
        IOptions<RabbitMqOptions> options,
        ILogger<RabbitMqEventPublisher> logger) : IEventPublisher, IAsyncDisposable
    {
        private readonly RabbitMqOptions _options = options.Value;
        private readonly ILogger<RabbitMqEventPublisher> _logger = logger;
        private readonly SemaphoreSlim _sync = new(1, 1);
        private IConnection? _connection;
        private IChannel? _channel;

        public async Task PublishAsync(string eventType, string payload, CancellationToken cancellationToken)
        {
            var channel = await GetChannelAsync(cancellationToken);
            var body = Encoding.UTF8.GetBytes(payload);
            var properties = new BasicProperties
            {
                Persistent = true,
                ContentType = "application/json",
                Type = eventType
            };

            await channel.BasicPublishAsync(
                exchange: _options.Exchange,
                routingKey: eventType,
                mandatory: false,
                basicProperties: properties,
                body: body,
                cancellationToken: cancellationToken);
        }

        public async ValueTask DisposeAsync()
        {
            await _sync.WaitAsync();
            try
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
            }
            finally
            {
                _sync.Release();
                _sync.Dispose();
            }
        }

        private async Task<IChannel> GetChannelAsync(CancellationToken cancellationToken)
        {
            if (_channel is { IsOpen: true })
            {
                return _channel;
            }

            await _sync.WaitAsync(cancellationToken);
            try
            {
                if (_channel is { IsOpen: true })
                {
                    return _channel;
                }

                if (_channel is not null)
                {
                    await _channel.DisposeAsync();
                    _channel = null;
                }

                if (_connection is null || !_connection.IsOpen)
                {
                    if (_connection is not null)
                    {
                        await _connection.DisposeAsync();
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

                    _connection = await factory.CreateConnectionAsync(cancellationToken);
                    _logger.LogInformation("RabbitMQ connection established for exchange {Exchange}", _options.Exchange);
                }

                _channel = await _connection.CreateChannelAsync(cancellationToken: cancellationToken);

                await _channel.ExchangeDeclareAsync(
                    exchange: _options.Exchange,
                    type: ExchangeType.Topic,
                    durable: true,
                    autoDelete: false,
                    cancellationToken: cancellationToken);

                return _channel;
            }
            finally
            {
                _sync.Release();
            }
        }
    }
}

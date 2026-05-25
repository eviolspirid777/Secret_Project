using Microsoft.Extensions.DependencyInjection;
using SecretProject.Infrastructure.Messaging.Abstractions;
using SecretProject.Infrastructure.Messaging.Serialization;

namespace SecretProject.Infrastructure.Messaging.RabbitMQ;

public sealed class RabbitMqConsumerBuilder
{
    private readonly List<RabbitMqSubscription> _subscriptions = [];

    public RabbitMqConsumerBuilder Subscribe<TMessage>(string eventType) where TMessage : class
    {
        _subscriptions.Add(new RabbitMqSubscription(
            eventType,
            async (services, json, cancellationToken) =>
            {
                var envelope = IntegrationEventSerializer.Deserialize<TMessage>(json)
                    ?? throw new InvalidOperationException($"Cannot deserialize event {eventType}");

                var handler = services.GetRequiredService<IIntegrationEventHandler<TMessage>>();
                await handler.HandleAsync(envelope, cancellationToken);
            }));

        return this;
    }

    internal IReadOnlyCollection<RabbitMqSubscription> Build()
    {
        return _subscriptions;
    }
}

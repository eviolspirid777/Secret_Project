namespace SecretProject.Infrastructure.Messaging.RabbitMQ;

public sealed class RabbitMqConsumerSettings
{
    public required string QueueName { get; init; }
    public required IReadOnlyCollection<RabbitMqSubscription> Subscriptions { get; init; }
}

namespace SecretProject.Infrastructure.Messaging.RabbitMQ;

public sealed class RabbitMqConsumerSettings
{
    public required string QueueName { get; init; }
    public int MaxRetryAttempts { get; init; } = 3;
    public TimeSpan RetryDelay { get; init; } = TimeSpan.FromSeconds(30);
    public required IReadOnlyCollection<RabbitMqSubscription> Subscriptions { get; init; }
}

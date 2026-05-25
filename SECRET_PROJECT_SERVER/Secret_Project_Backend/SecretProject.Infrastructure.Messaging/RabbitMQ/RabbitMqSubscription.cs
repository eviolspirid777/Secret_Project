namespace SecretProject.Infrastructure.Messaging.RabbitMQ;

public sealed record RabbitMqSubscription(
    string EventType,
    Func<IServiceProvider, string, CancellationToken, Task> HandleAsync);

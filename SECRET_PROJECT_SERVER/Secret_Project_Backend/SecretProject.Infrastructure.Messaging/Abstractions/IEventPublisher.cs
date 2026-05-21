
namespace SecretProject.Infrastructure.Messaging.Abstractions;

public interface IEventPublisher
{
    Task PublishAsync(string eventType, string payload, CancellationToken cancellationToken);
}

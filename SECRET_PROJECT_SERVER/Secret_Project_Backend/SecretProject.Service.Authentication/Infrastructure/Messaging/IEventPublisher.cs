namespace SecretProject.Service.Authentication.Infrastructure.Messaging
{
    public interface IEventPublisher
    {
        Task PublishAsync(string eventType, string payload, CancellationToken cancellationToken);
    }
}

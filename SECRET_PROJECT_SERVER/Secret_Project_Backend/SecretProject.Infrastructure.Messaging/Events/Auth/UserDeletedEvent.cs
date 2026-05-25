namespace SecretProject.Infrastructure.Messaging.Events.Auth;

public class UserDeletedEvent
{
    public required Guid UserId { get; init; }
}

namespace SecretProject.Infrastructure.Messaging.Events.Auth;

public sealed class UserEmailConfirmedEvent
{
    public required Guid UserId { get; init; }
    public required DateTimeOffset ConfirmedAtUtc { get; init; }
}

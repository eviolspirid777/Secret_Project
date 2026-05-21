namespace SecretProject.Service.Authentication.Storage.Contracts.Events;

public sealed class UserRegisteredEvent
{
    public required Guid UserId { get; init; }
    public required string Email { get; init; }
    public required string DisplayName { get; init; }
}

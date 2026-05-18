namespace SecretProject.Service.Authentication.Storage.Contracts.Events;

public sealed class UserRegisteredEvent
{
    public required string UserId { get; init; }
    public required string Email { get; init; }
    public required string DisplayName { get; init; }
}

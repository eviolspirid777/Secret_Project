namespace SecretProject.Service.Authentication.Storage.Contracts.Events;

public static class AuthenticationEventTypes
{
    public const string UserRegistered = "user.registered";
    public const string UserEmailConfirmed = "auth.user.email_confirmed";
    public const string UserDeleted = "auth.user.deleted";
}

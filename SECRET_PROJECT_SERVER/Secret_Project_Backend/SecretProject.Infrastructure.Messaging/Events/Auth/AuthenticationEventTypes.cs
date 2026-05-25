namespace SecretProject.Infrastructure.Messaging.Events.Auth;

public static class AuthenticationEventTypes
{
    public const string UserRegistered = "auth.user.registered.v1";
    public const string EmailConfirmationRequested = "auth.email.confirmation_requested.v1";
    public const string UserEmailConfirmed = "auth.user.email_confirmed.v1";
    public const string UserDeleted = "auth.user.deleted.v1";
}

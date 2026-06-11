namespace SecretProject.Service.HttpGateway.Web.DataStore.Authentication.Requests;

public sealed class LoginHttpRequest
{
    public required string Email { get; set; }
    public required string Password { get; set; }
}

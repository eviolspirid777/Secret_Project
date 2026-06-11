namespace SecretProject.Service.HttpGateway.Web.DataStore.Authentication.Requests;

public sealed class RegisterHttpRequest
{
    public required string Email { get; set; }
    public required string Password { get; set; }
    public required string DisplayName { get; set; }
}

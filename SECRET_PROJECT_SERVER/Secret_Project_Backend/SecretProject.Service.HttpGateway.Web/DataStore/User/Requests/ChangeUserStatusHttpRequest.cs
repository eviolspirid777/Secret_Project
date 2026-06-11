namespace SecretProject.Service.HttpGateway.Web.DataStore.User.Requests;

public sealed class ChangeUserStatusHttpRequest
{
    public required string UserId { get; set; }
    public required string Status { get; set; }
}

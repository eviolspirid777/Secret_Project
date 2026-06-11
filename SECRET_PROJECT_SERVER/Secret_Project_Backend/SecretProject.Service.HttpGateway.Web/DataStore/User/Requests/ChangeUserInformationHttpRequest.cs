namespace SecretProject.Service.HttpGateway.Web.DataStore.User.Requests;

public sealed class ChangeUserInformationHttpRequest
{
    public required string UserId { get; set; }
    public byte[] Avatar { get; set; } = [];
    public string Name { get; set; } = string.Empty;
}

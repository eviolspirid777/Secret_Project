namespace SecretProject.Service.HttpGateway.Web.Controllers.Requests;

public class UserInformationRequest
{
    public required string UserId { get; set; }
    public byte[]? Avatar { get; set; }
    public string Name { get; set; }
}

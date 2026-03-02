namespace SecretProject.Service.HttpGateway.Web.Controllers.Requests;

public class ChangeUserStatusRequest
{
    public required string UserId { get; set; }
    public required string Status { get; set; }
}

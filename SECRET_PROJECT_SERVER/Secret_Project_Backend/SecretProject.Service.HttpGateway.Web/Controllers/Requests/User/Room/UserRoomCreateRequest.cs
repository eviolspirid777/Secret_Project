namespace SecretProject.Service.HttpGateway.Web.Controllers.Requests;

public class UserRoomCreateRequest
{
    public required string FromUserId { get; set; }
    public required string ToUserId { get; set; }
}

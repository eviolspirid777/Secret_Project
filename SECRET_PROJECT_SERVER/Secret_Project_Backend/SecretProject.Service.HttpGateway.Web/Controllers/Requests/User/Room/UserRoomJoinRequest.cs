namespace SecretProject.Service.HttpGateway.Web.Controllers.Requests;

public class UserRoomJoinRequest
{
    public required Guid RoomId { get; set; }
    public required string UserId { get; set; }
}

namespace Secret_Project_Backend.Controllers.Requests.User.Room
{
    public class UserRoomJoinRequest
    {
        public required Guid RoomId { get; set; }
        public required string UserId { get; set; }
    }
}

namespace Secret_Project_Backend.Controllers.Requests.User.Room
{
    public class UserRoomCreateRequest
    {
        public required string FromUserId { get; set; }
        public required string ToUserId { get; set; }
    }
}

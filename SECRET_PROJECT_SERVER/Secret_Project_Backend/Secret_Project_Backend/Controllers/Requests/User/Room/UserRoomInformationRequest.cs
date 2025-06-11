namespace Secret_Project_Backend.Controllers.Requests.User.Room
{
    public class UserRoomInformationRequest
    {
        public required string FromUserId { get; set; }
        public required string ToUserId { get; set; }
    }
}

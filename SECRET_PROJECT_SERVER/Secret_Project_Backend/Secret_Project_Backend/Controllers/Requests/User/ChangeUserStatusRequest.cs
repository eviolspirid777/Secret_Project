namespace Secret_Project_Backend.Controllers.Requests.User
{
    public class ChangeUserStatusRequest
    {
        public required string UserId { get; set; }
        public required string Status { get; set; }
    }
}

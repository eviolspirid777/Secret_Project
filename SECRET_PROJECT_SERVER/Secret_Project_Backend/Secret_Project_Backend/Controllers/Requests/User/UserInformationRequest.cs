namespace Secret_Project_Backend.Controllers.Requests.User
{
    public class UserInformationRequest
    {
        public required string UserId { get; set; }
        public byte[]? Avatar { get; set; }
        public string Name { get; set; }
    }
}

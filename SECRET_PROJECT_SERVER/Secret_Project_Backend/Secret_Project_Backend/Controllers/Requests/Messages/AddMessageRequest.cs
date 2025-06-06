namespace Secret_Project_Backend.Controllers.Requests.Messages
{
    public class AddMessageRequest
    {
        public required string SenderId { get; set; }
        public required string ReciverId { get; set; }
        public required string Content { get; set; }
    }
}

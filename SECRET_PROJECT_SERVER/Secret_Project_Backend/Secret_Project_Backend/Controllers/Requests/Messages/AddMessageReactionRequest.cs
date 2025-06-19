namespace Secret_Project_Backend.Controllers.Requests.Messages
{
    public class AddMessageReactionRequest
    {
        public required string Emotion { get; set; }
        public required string UserId { get; set; }
        public required Guid MessageId { get; set; }

    }
}

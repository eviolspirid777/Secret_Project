namespace Secret_Project_Backend.Controllers.Requests.Channels
{
    public class AddChannelMessageReactionRequest
    {
        public required string Emotion { get; set; }
        public required string UserId { get; set; }
        public required Guid ChannelMessageId { get; set; }
    }
}

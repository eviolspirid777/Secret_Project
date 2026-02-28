namespace Secret_Project_Backend.Controllers.Requests.Messages
{
    public class ChannelMessageDeleteRequest
    {
        public Guid ChannelId { get; set;}
        public Guid MessageId { get; set;}
    }
}

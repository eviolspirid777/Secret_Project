using Secret_Project_Backend.DTOs;

namespace Secret_Project_Backend.Controllers.Requests.Messages
{
    public class ChannelMessageAddRequest
    {
        public ChannelMessageDto Message { get; set; }
        public Guid ChannelId { get; set; }
    }

    public class ChannelMessageDeleteRequest
    {
        public Guid ChannelId { get; set;}
        public Guid MessageId { get; set;}
    }
}

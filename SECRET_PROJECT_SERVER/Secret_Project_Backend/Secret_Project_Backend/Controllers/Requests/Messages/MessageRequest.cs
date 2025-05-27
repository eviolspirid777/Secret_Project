using Secret_Project_Backend.DTOs;

namespace Secret_Project_Backend.Controllers.Requests.Messages
{
    public class MessageAddRequest
    {
        public IEnumerable<MessageDto> Messages { get; set; }
        public Guid ChannelId { get; set; }
    }

    public class MessageDeleteRequest
    {
        public Guid ChannelId { get; set;}
        public Guid MessageId { get; set;}
    }
}

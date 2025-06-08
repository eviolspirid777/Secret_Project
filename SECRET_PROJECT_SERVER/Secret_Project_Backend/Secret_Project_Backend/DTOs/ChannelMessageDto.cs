using Secret_Project_Backend.DTOs.Channel;
using Secret_Project_Backend.Models;

namespace Secret_Project_Backend.DTOs
{
    public class ChannelMessageDto
    {
        public Guid Id { get; set; }
        public string? Content { get; set; }
        public DateTime SentAt { get; set; }
        public string SenderId { get; set; }
        public Guid ChannelId { get; set; }
        public ChannelFileDto? File { get; set; }
    }
}

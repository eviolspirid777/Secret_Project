using Secret_Project_Backend.DTOs.File;
using Secret_Project_Backend.DTOs.Reactions;
using Secret_Project_Backend.DTOs.RepliedMessage;

namespace Secret_Project_Backend.DTOs.Messages
{
    public class MessageDto
    {
        public Guid Id { get; set; }
        public string Content { get; set; }
        public string SenderId { get; set; }
        public string ReciverId { get; set; }
        public DateTime SentAt { get; set; }
        public FileDto File { get; set; }
        public RepliedMessageDTO? RepliedMessage { get; set; }
        public List<ReactionDto>? Reactions { get; set; }
    }
}

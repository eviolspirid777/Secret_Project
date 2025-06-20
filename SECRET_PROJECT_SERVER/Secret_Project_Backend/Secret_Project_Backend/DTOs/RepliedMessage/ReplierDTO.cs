using Secret_Project_Backend.DTOs.File;

namespace Secret_Project_Backend.DTOs.RepliedMessage
{
    public class RepliedMessageDTO
    {
        public Guid? RepliedMessageId { get; set; }
        public string SenderName { get; set; }
        public string? Content { get; set; }
        public FileDto? File { get; set; }
    }
}

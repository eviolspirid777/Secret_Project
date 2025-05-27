using Secret_Project_Backend.Models;

namespace Secret_Project_Backend.DTOs
{
    public class ChannelDto
    {
        public string Name { get; set; } = string.Empty;
        public ChannelType Type { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.Now;
    }
}

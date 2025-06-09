using Secret_Project_Backend.Models;

namespace Secret_Project_Backend.DTOs
{
    public class ChannelDto
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string ChannelAvatarUrl { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}

using System.ComponentModel.DataAnnotations;

namespace Secret_Project_Backend.DTOs.Channel
{
    public class ChannelFileDto
    {
        public Guid Id { get; set; }
        public string FileUrl { get; set; }
        public string FileType { get; set; }
        public string FileName { get; set; }
    }
}

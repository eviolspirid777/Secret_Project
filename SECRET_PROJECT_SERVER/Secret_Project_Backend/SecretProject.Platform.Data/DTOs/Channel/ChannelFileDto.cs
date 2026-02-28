using System.ComponentModel.DataAnnotations;

namespace SecretProject.Platform.Data.DTOs.Channel;
public class ChannelFileDto
{
    public Guid Id { get; set; }
    public string FileUrl { get; set; }
    public string FileType { get; set; }
    public string FileName { get; set; }
}

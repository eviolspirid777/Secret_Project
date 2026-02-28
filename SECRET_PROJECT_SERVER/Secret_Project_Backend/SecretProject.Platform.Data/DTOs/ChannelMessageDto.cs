using SecretProject.Platform.Data.DTOs.Channel;


namespace SecretProject.Platform.Data.DTOs;
public class ChannelMessageDto
{
    public Guid? Id { get; set; }
    public string? Content { get; set; }
    public DateTime? SentAt { get; set; }
    public string SenderId { get; set; }
    public Guid ChannelId { get; set; }
    public ChannelFileDto? File { get; set; }
}

using SecretProject.Platform.Data.DTOs.File;

namespace SecretProject.Platform.Data.DTOs.RepliedMessage;

public class RepliedMessageDTO
{
    public Guid? RepliedMessageId { get; set; }
    public string SenderName { get; set; }
    public string? Content { get; set; }
    public FileDto? File { get; set; }
}

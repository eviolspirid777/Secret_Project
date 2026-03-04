using SecretProject.Platform.Data.DataStore.DTOs.File;

namespace SecretProject.Platform.Data.DataStore.DTOs.RepliedMessage;

public class RepliedMessageDTO
{
    public Guid? RepliedMessageId { get; set; }
    public string SenderName { get; set; }
    public string? Content { get; set; }
    public FileDto? File { get; set; }
}

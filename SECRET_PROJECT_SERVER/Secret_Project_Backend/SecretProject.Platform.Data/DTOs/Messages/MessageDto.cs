
using SecretProject.Platform.Data.DTOs.File;
using SecretProject.Platform.Data.DTOs.Reactions;
using SecretProject.Platform.Data.DTOs.RepliedMessage;

namespace SecretProject.Platform.Data.DTOs.Messages;

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

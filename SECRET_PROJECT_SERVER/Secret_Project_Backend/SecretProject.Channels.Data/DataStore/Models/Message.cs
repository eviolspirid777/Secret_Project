using System.ComponentModel.DataAnnotations;

namespace SecretProject.Channels.Data.DataStore.Models;

public class Message
{
    [Key]
    public Guid Id { get; set; }
    public string SenderId { get; set; }
    public string ReciverId { get; set; }
    public DateTime SentAt { get; set; }
    public string? Content { get; set; }
    public Guid? FileId { get; set; }
    public virtual File File { get; set; }
    public Guid? RepliedId { get; set; }
    public Message? RepliedMessage { get; set; }
    public virtual ICollection<Reaction>? Reactions { get; set; }
}

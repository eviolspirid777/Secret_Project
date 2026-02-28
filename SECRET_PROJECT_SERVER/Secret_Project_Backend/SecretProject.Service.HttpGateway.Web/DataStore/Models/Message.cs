using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SecretProject.Service.HttpGateway.Web.DataStore.Models;

public class Message
{
    [Key]
    public Guid Id { get; set; }
    public string SenderId { get; set; }
    public virtual ApplicationUser Sender { get; set; }
    public string ReciverId { get; set; }
    public virtual ApplicationUser Reciver { get; set; }
    public DateTime SentAt { get; set; }
    public string? Content { get; set; }
    public Guid? FileId { get; set; }
    public virtual File File { get; set; }
    public Guid? RepliedId { get; set; }
    public Message? RepliedMessage { get; set; }
    public virtual ICollection<Reaction>? Reactions { get; set; }
}

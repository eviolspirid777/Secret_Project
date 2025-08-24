namespace Secret_Project_Backend.Models
{
    public class ChannelMessage
    {
        public Guid Id { get; set; }
        public string? Content { get; set; }
        public Guid ChannelId { get; set; }
        public virtual Channel Channel { get; set; }
        public string SenderId { get; set; }
        public virtual ApplicationUser Sender { get; set; }
        public DateTime SentAt { get; set; }
        public Guid ChannelFileId { get; set; }
        public virtual ChannelFile? ChannelFile { get; set; }
        public Guid? RepliedId { get; set; }
        public ChannelMessage? RepliedChannelMessage { get; set; }
        public virtual ICollection<Reaction>? Reactions { get; set; }
    }
}

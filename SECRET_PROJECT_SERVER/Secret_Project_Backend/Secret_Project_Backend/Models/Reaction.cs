using System.ComponentModel.DataAnnotations;

namespace Secret_Project_Backend.Models
{
    public class Reaction
    {
        [Key]
        public Guid Id { get; set; }
        public string Emotion { get; set; }
        public string UserId { get; set; }
        public ApplicationUser User { get; set; }
        public Guid? MessageId { get; set; }
        public Message? Message { get; set; }
        public Guid? ChannelMessageId { get; set; }
        public ChannelMessage? ChannelMessage { get; set; }

    }
}

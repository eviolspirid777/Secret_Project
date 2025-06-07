using System.ComponentModel.DataAnnotations;

namespace Secret_Project_Backend.Models
{
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
        public string? FileUrl { get; set; }
        public string? FileType { get; set; }
    }
}

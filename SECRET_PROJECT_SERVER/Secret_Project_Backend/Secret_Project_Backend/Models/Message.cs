﻿namespace Secret_Project_Backend.Models
{
    public class Message
    {
        public Guid Id { get; set; }
        public string Content { get; set; }
        public DateTime SentAt { get; set; }
        public string SenderId { get; set; }
        public virtual ApplicationUser Sender { get; set; }
        public Guid ChannelId { get; set; }
        public virtual Channel Channel { get; set; }
    }
}

namespace Secret_Project_Backend.Models
{
    public enum ChannelRole
    {
        Member = 0,
        Admin = 1
    }
    public class ChannelUser
    {
        public string UserId { get; set; }
        public virtual ApplicationUser User { get; set; }
        public Guid ChannelId { get; set; }
        public virtual Channel Channel { get; set; }
        public ChannelRole Role { get; set; }
    }
}

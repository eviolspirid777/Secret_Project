namespace Secret_Project_Backend.Models
{
    public enum ChannelType
    {
        Text = 0,
        Voice = 1,
    }
    public class Channel
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public ChannelType Type { get; set; }
        public DateTime CreatedAt { get; set; }

        public virtual ICollection<ChannelMessage> ChannelMessages { get; set; }
        public virtual ICollection<ChannelUser> ChannelUsers { get; set; }
    }
}

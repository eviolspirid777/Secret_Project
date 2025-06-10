using Microsoft.AspNetCore.Identity;

namespace Secret_Project_Backend.Models
{
    public enum ConnectionState
    {
        Online,
        Offline,
        Sleeping,
        NotDisturb
    }
    public class ApplicationUser: IdentityUser
    {
        public string DisplayName { get; set; } = string.Empty;
        public string? AvatarUrl { get; set; } = null;
        public bool IsMicrophoneMuted { get; set; } = false;
        public bool IsHeadphonesMuted { get; set; } = false;
        public ConnectionState Status { get; set; } = ConnectionState.Offline;
        public virtual ICollection<Channel>? ChannelsAdmin { get; set; } = new List<Channel>();
        public virtual ICollection<Message> SentMessages { get; set; } = new List<Message>();
        public virtual ICollection<Message> ReceivedMessages { get; set; } = new List<Message>();
        public virtual ICollection<ChannelMessage> ChannelMessages { get; set; } = new List<ChannelMessage>();
        public virtual ICollection<ChannelUser> ChannelUsers { get; set; } = new List<ChannelUser>();
        public virtual ICollection<Friendship> Friends { get; set; } = new List<Friendship>();
        public virtual ICollection<Friendship> FriendOf { get; set; } = new List<Friendship>();
    }
}

using Microsoft.AspNetCore.Identity;

namespace Secret_Project_Backend.Models
{
    public enum States
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
        public States Status { get; set; } = States.Offline;
        public virtual ICollection<Message> Messages { get; set; } = new List<Message>();
        public virtual ICollection<ChannelUser> ChannelUsers { get; set; } = new List<ChannelUser>();
        public virtual ICollection<Friendship> Friends { get; set; } = new List<Friendship>();
        public virtual ICollection<Friendship> FriendOf { get; set; } = new List<Friendship>();
    }
}

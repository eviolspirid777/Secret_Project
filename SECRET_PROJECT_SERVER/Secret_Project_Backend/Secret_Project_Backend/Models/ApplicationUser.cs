using Microsoft.AspNetCore.Identity;

namespace Secret_Project_Backend.Models
{
    public class ApplicationUser: IdentityUser
    {
        public string DisplayName { get; set; } = string.Empty;
        public string? AvatarUrl { get; set; } = null;

        public virtual ICollection<Message> Messages { get; set; } = new List<Message>();
        public virtual ICollection<ChannelUser> ChannelUsers { get; set; } = new List<ChannelUser>();
    }
}

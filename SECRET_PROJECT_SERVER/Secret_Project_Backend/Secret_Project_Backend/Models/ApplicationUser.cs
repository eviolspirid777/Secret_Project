using Microsoft.AspNetCore.Identity;

namespace Secret_Project_Backend.Models
{
    public class ApplicationUser: IdentityUser
    {
        public string DisplayName { get; set; }
        public string? AvatarUrl { get; set; } = null;

        public virtual ICollection<Message> Messages { get; set; }
        public virtual ICollection<ChannelUser> ChannelUsers { get; set; }
    }
}

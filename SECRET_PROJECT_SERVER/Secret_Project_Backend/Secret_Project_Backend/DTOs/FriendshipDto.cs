
using Secret_Project_Backend.Models;

namespace Secret_Project_Backend.DTOs
{
    public class UserDto
    {
        public string Id { get; set; }
        public string UserName { get; set; }
        public string Email { get; set; }
        public string DisplayName { get; set; }
        public string? AvatarUrl { get; set; }
        public ConnectionState Status { get; set; }
    }

    public class FriendshipDto
    {
        public string Id { get; set; }
        public UserDto User { get; set; }
        public UserDto Friend { get; set; }
        public FriendshipStatus Status { get; set; }
    }
} 

using Secret_Project_Backend.DTOs.User;
using Secret_Project_Backend.Models;

namespace Secret_Project_Backend.DTOs
{
    public class FriendshipDto
    {
        public string Id { get; set; }
        public UserDTO User { get; set; }
        public UserDTO Friend { get; set; }
        public FriendshipStatus Status { get; set; }
    }
} 
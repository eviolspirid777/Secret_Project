using Secret_Project_Backend.Models;

namespace Secret_Project_Backend.DTOs.User
{
    public class UserDTO
    {
        public string UserId { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Avatar { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public SoundConnectionState States { get; set; } = new SoundConnectionState();
    }

    public class SoundConnectionState
    {
        public bool IsMicrophoneMuted { get; set; }
        public bool IsHeadphonesMuted { get; set; }
    }
}

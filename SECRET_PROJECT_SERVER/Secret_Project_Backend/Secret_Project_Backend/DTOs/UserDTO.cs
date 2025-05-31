namespace Secret_Project_Backend.DTOs
{
    public class UserDTO
    {
        public string UserId { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Avatar { get; set; } = string.Empty;
        public States States { get; set; } = new States();
    }

    public class States
    {
        public bool IsMicrophoneMuted { get; set; }
        public bool IsHeadphonesMuted { get; set; }
    }
}

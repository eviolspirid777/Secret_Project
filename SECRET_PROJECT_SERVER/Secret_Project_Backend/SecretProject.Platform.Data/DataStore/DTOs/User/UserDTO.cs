namespace SecretProject.Platform.Data.DataStore.DTOs.User;

public class UserDTO
{
    public Guid UserId { get; set; }
    public required string Name { get; set; } = string.Empty;
    public required string Email { get; set; } = string.Empty;
    public string Avatar { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public SoundConnectionState States { get; set; } = new SoundConnectionState();
}

public class SoundConnectionState
{
    public bool IsMicrophoneMuted { get; set; }
    public bool IsHeadphonesMuted { get; set; }
}

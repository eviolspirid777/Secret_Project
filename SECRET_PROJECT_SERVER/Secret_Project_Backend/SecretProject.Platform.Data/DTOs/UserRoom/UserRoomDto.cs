namespace SecretProject.Platform.Data.DTOs.UserRoom;

public class UserRoomDto
{
    public Guid Id { get; set; }
    public Guid[]? MutedAudioUserIds { get; set; }
    public Guid[]? MutedVideoUserIds { get; set; }
    public string LeftUserId { get; set; }
    public string RightUserId { get; set; }
}

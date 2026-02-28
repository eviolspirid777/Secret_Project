namespace SecretProject.Platform.Data.DTOs.Room;

public class RoomDto
{
    public Guid Id { get; set; }
    public Guid[] MutedAudioUserIds { get; set; }
    public Guid[] MutedVideoUserIds { get; set; }
    public Guid[] BlockedUsers { get; set; }
}

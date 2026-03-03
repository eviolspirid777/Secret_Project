namespace SecretProject.Platform.Data.DataStore.DTOs.Reactions;

public class ReactionDto
{
    public string Id { get; set; }
    public Guid MessageId{ get; set; }
    public string UserId { get; set; }
    public string Emotion { get; set; }
}

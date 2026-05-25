namespace SecretProject.User.Data.DataStore.Entities;

public sealed class ProcessedEvent
{
    public required Guid EventId { get; set; }
    public required string EventType { get; set; }
    public required DateTimeOffset ProcessedAtUtc { get; set; }
}

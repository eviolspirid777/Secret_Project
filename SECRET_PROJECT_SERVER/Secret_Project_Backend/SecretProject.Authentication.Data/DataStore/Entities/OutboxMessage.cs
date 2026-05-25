namespace SecretProject.Authentication.Data.DataStore.Entities
{
    public sealed class OutboxMessage
    {
        public required Guid Id { get; set; }
        public required string Type { get; set; }
        public required string Payload { get; set; }
        public required DateTimeOffset OccurredAtUtc { get; set; }
        public DateTimeOffset? ProcessedAtUtc { get; set; }
        public string? Error { get; set; }
    }
}

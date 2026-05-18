namespace SecretProject.Authentication.Data.DataStore.Entities
{
    public sealed class OutboxMessage
    {
        public required Guid Id { get; set; }
        public required string Type { get; set; }
        public required string Payload { get; set; }
        public required DateTime OccurredAtUtc { get; set; }
        public DateTime? ProcessedAtUtc { get; set; }
        public string? Error { get; set; }
    }
}

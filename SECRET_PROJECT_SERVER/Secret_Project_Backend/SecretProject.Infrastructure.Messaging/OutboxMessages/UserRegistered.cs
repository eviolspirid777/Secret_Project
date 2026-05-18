namespace SecretProject.Infrastructure.Messaging.OutboxMessages
{
    public sealed class UserRegistered
    {
        public required Guid Id { get; set; }
        public required string Type { get; set; }
        public required string Payload { get; set; }
        public required DateTime OccuredAt { get; set; }
        public DateTime? ProcessedAt { get; set; }
        public string? Error { get; set; }
    }
}

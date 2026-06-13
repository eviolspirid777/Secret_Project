using System;
using System.Collections.Generic;
using System.Text;

namespace SecretProject.File.Data.DataStore.Entities
{
    public class OutboxMessage
    {
        public Guid Id { get; set; }
        public string Type { get; set; } = string.Empty;
        public string Payload { get; set; } = string.Empty;
        public DateTimeOffset OccurredAtUtc { get; set; }
        public DateTimeOffset? ProcessedAtUtc { get; set; }
        public string? Error { get; set; }
    }
}

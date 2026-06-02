using System;
using System.Collections.Generic;
using System.Text;

namespace SecretProject.Distribution.Data.DataStore.Entities
{
    public sealed class ProcessedEvent
    {
        public required Guid EventId { get; set; }
        public required string EventType { get; set; }
        public required DateTimeOffset ProcessedAtUtc { get; set; }
    }
}


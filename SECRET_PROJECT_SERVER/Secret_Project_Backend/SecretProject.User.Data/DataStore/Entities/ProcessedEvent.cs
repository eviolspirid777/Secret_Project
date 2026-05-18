using System;
using System.Collections.Generic;
using System.Text;

namespace SecretProject.User.Data.DataStore.Entities
{
    public class ProcessedEvent
    {
        public required Guid EventId { get; set; }
        public required string EventType { get; set; }
        public required DateTime ProcessedAtUtc { get; set; }

    }
}

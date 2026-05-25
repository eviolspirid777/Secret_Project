using System;
using System.Collections.Generic;
using System.Text;

namespace SecretProject.Infrastructure.Messaging.Contracts
{
    public sealed class IntegrationEventEnvelope<TMessage> where TMessage : class
    {
        public required Guid EventId { get; init; }
        public required string EventType { get; init; }
        public required DateTimeOffset OccurredAtUtc { get; init; }
        public required int Version { get; init; }
        public required TMessage Message { get; init; }
    }
}

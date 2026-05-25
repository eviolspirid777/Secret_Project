using System;
using System.Collections.Generic;
using System.Text;

namespace SecretProject.Infrastructure.Messaging.Contracts
{
    public sealed class IntegrationEventEnvelope<TPayload> where TPayload : class
    {
        public required Guid EventId { get; init; }
        public required string EventType { get; init; }
        public required DateTime OccurredAtUtc { get; init; }
        public required int Version { get; init; }
        public required TPayload Payload { get; init; }
    }
}

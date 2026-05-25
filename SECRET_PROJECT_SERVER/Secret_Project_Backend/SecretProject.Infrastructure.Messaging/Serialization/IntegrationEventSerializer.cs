using SecretProject.Infrastructure.Messaging.Contracts;
using System;
using System.Collections.Generic;
using System.Text;

namespace SecretProject.Infrastructure.Messaging.Serialization
{
    public static class IntegrationEventSerializer
    {
        public static string Serialize<TPayload>(IntegrationEventEnvelope<TPayload> envelope) where TPayload : class
        {
            return Serialize<TPayload>(envelope); 
        }

        public static IntegrationEventEnvelope<TPayload>? Deserialize<TPayload>(string json) where TPayload : class
        {
            return Deserialize<TPayload>(json); 
        }
    }
}

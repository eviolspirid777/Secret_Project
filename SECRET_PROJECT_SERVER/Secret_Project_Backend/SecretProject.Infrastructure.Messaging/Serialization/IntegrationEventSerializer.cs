using System.Text.Json;
using SecretProject.Infrastructure.Messaging.Contracts;

namespace SecretProject.Infrastructure.Messaging.Serialization;

public static class IntegrationEventSerializer
{
    private static readonly JsonSerializerOptions Options = new(JsonSerializerDefaults.Web);

    public static string Serialize<TMessage>(IntegrationEventEnvelope<TMessage> envelope) where TMessage : class
    {
        return JsonSerializer.Serialize(envelope, Options);
    }

    public static IntegrationEventEnvelope<TMessage>? Deserialize<TMessage>(string json) where TMessage : class
    {
        return JsonSerializer.Deserialize<IntegrationEventEnvelope<TMessage>>(json, Options);
    }

}

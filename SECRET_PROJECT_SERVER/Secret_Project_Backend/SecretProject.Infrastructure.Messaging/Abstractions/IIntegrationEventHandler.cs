using SecretProject.Infrastructure.Messaging.Contracts;
using System;
using System.Collections.Generic;
using System.Text;

namespace SecretProject.Infrastructure.Messaging.Abstractions
{
    public interface IIntegrationEventHandler<TMessage>
    where TMessage : class
    {
        Task HandleAsync(
            IntegrationEventEnvelope<TMessage> envelope,
            CancellationToken cancellationToken);
    }
}

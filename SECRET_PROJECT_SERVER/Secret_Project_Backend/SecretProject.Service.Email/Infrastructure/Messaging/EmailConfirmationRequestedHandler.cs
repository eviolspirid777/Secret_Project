using SecretProject.Infrastructure.Messaging.Abstractions;
using SecretProject.Infrastructure.Messaging.Contracts;
using SecretProject.Infrastructure.Messaging.Events.Email;

namespace SecretProject.Service.Email.Infrastructure.Messaging
{
    public class EmailConfirmationRequestedHandler() : IIntegrationEventHandler<EmailConfirmationRequestedEvent>
    {
        public async Task HandleAsync(IntegrationEventEnvelope<EmailConfirmationRequestedEvent> envelope, CancellationToken cancellationToken)
        {
            //var alreadyProcessed = await dbContext.ProcessedEvents
            //            .AnyAsync(x => x.EventId == envelope.EventId, cancellationToken);

            //if (alreadyProcessed)
            //{
            //    return;
            //}
        }
    }
}

using Microsoft.EntityFrameworkCore;
using SecretProject.Distribution.Data.DataStore.Context;
using SecretProject.Distribution.Data.DataStore.Entities;
using SecretProject.Infrastructure.Messaging.Abstractions;
using SecretProject.Infrastructure.Messaging.Contracts;
using SecretProject.Infrastructure.Messaging.Events.Email;
using SecretProject.Service.Email.DataStore.Abstractions;

namespace SecretProject.Service.Email.Infrastructure.Messaging
{
    public class EmailConfirmationRequestedHandler(DistributionDbContext dbContext,
                                                   IEmailService emailService) : IIntegrationEventHandler<EmailConfirmationRequestedEvent>
    {
        private readonly IEmailService _emailService = emailService;
        public async Task HandleAsync(IntegrationEventEnvelope<EmailConfirmationRequestedEvent> envelope, CancellationToken cancellationToken)
        {
            var alreadyProcessed = await dbContext.ProcessedEvents
                        .AnyAsync(x => x.EventId == envelope.EventId, cancellationToken);

            if (alreadyProcessed)
            {
                return;
            }

            await _emailService.SendEmailConfirmationAsync(envelope.Message.Email, envelope.Message.UserId.ToString(), envelope.Message.ConfirmationToken);

            dbContext.ProcessedEvents.Add(new ProcessedEvent
            {
                EventId = envelope.EventId,
                EventType = envelope.EventType,
                ProcessedAtUtc = DateTimeOffset.UtcNow
            });

            await dbContext.SaveChangesAsync(cancellationToken);
        }
    }
}

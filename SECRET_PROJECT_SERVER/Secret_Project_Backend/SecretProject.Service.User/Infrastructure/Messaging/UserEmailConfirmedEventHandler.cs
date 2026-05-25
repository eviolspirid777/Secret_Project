using Microsoft.EntityFrameworkCore;
using SecretProject.Infrastructure.Messaging.Abstractions;
using SecretProject.Infrastructure.Messaging.Contracts;
using SecretProject.Infrastructure.Messaging.Events.Auth;
using SecretProject.User.Data.DataStore.Context;
using SecretProject.User.Data.DataStore.Entities;

namespace SecretProject.Service.User.Infrastructure.Messaging;

public sealed class UserEmailConfirmedEventHandler(UserDbContext dbContext) : IIntegrationEventHandler<UserEmailConfirmedEvent>
{
    public async Task HandleAsync(
        IntegrationEventEnvelope<UserEmailConfirmedEvent> envelope,
        CancellationToken cancellationToken)
    {
        var alreadyProcessed = await dbContext.ProcessedEvents
            .AnyAsync(x => x.EventId == envelope.EventId, cancellationToken);

        if (alreadyProcessed)
        {
            return;
        }

        var profile = await dbContext.UserProfiles
            .FirstOrDefaultAsync(x => x.Id == envelope.Message.UserId, cancellationToken);

        if (profile is not null)
        {
            profile.ActivationState = ActivationState.Confirmed;
            profile.UpdatedAt = envelope.Message.ConfirmedAtUtc;
        }

        dbContext.ProcessedEvents.Add(new ProcessedEvent
        {
            EventId = envelope.EventId,
            EventType = envelope.EventType,
            ProcessedAtUtc = DateTimeOffset.UtcNow
        });

        await dbContext.SaveChangesAsync(cancellationToken);
    }
}

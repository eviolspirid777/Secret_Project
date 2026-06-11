using Microsoft.EntityFrameworkCore;
using SecretProject.Infrastructure.Messaging.Abstractions;
using SecretProject.Infrastructure.Messaging.Contracts;
using SecretProject.Infrastructure.Messaging.Events.Auth;
using SecretProject.User.Data.DataStore.Context;
using SecretProject.User.Data.DataStore.Entities;

namespace SecretProject.Service.User.Infrastructure.Messaging;

public sealed class UserRegisteredEventHandler(UserDbContext dbContext) : IIntegrationEventHandler<UserRegisteredEvent>
{
    public async Task HandleAsync(
        IntegrationEventEnvelope<UserRegisteredEvent> envelope,
        CancellationToken cancellationToken)
    {
        var alreadyProcessed = await dbContext.ProcessedEvents
            .AnyAsync(x => x.EventId == envelope.EventId, cancellationToken);

        if (alreadyProcessed)
        {
            return;
        }

        var profileExists = await dbContext.UserProfiles
            .AnyAsync(x => x.Id == envelope.Message.UserId, cancellationToken);

        if (!profileExists)
        {
            dbContext.UserProfiles.Add(new UserProfile
            {
                Id = envelope.Message.UserId,
                Name = envelope.Message.DisplayName,
                PresenceState = PresenceState.Offline,
                ActivationState = ActivationState.Pending,
                CreatedAt = envelope.OccurredAtUtc,
                IsHeadphonesMuted = false,
                IsMicrophoneMuted= false,
            });
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

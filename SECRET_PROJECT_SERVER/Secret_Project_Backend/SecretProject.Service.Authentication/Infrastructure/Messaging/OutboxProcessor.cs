using Microsoft.EntityFrameworkCore;
using SecretProject.Authentication.Data.DataStore.Context;

namespace SecretProject.Service.Authentication.Infrastructure.Messaging
{
    public sealed class OutboxProcessor(
        IServiceScopeFactory scopeFactory,
        IEventPublisher eventPublisher,
        ILogger<OutboxProcessor> logger) : BackgroundService
    {
        private static readonly TimeSpan PollingInterval = TimeSpan.FromSeconds(2);
        private const int BatchSize = 20;

        private readonly IServiceScopeFactory _scopeFactory = scopeFactory;
        private readonly IEventPublisher _eventPublisher = eventPublisher;
        private readonly ILogger<OutboxProcessor> _logger = logger;

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    await ProcessBatchAsync(stoppingToken);
                }
                catch (OperationCanceledException) when (stoppingToken.IsCancellationRequested)
                {
                    break;
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Failed to process authentication outbox batch");
                }

                try
                {
                    await Task.Delay(PollingInterval, stoppingToken);
                }
                catch (OperationCanceledException) when (stoppingToken.IsCancellationRequested)
                {
                    break;
                }
            }
        }

        private async Task ProcessBatchAsync(CancellationToken cancellationToken)
        {
            using var scope = _scopeFactory.CreateScope();
            var dbContext = scope.ServiceProvider.GetRequiredService<AuthDbContext>();

            var batch = await dbContext.OutboxMessages
                .Where(x => x.ProcessedAtUtc == null)
                .OrderBy(x => x.OccurredAtUtc)
                .Take(BatchSize)
                .ToListAsync(cancellationToken);

            if (batch.Count == 0)
            {
                return;
            }

            foreach (var message in batch)
            {
                try
                {
                    await _eventPublisher.PublishAsync(message.Type, message.Payload, cancellationToken);
                    message.ProcessedAtUtc = DateTime.UtcNow;
                    message.Error = null;
                }
                catch (Exception ex)
                {
                    message.Error = ex.Message;
                    _logger.LogError(ex, "Failed to publish outbox message {OutboxMessageId} of type {MessageType}", message.Id, message.Type);
                }
            }

            await dbContext.SaveChangesAsync(cancellationToken);
        }
    }
}

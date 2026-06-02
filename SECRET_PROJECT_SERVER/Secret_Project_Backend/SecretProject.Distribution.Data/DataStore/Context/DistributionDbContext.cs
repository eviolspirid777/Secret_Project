using Microsoft.EntityFrameworkCore;
using SecretProject.Distribution.Data.DataStore.Entities;

namespace SecretProject.Distribution.Data.DataStore.Context
{
    public class DistributionDbContext : DbContext
    {
        private readonly string _schema = "distribution";

        public DistributionDbContext(DbContextOptions<DistributionDbContext> options) : base(options)
        {
        }
        public DbSet<ProcessedEvent> ProcessedEvents => Set<ProcessedEvent>();
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
                throw new InvalidOperationException("DistributionDbContext требует заполненных DbContextOptions.");
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.HasDefaultSchema(_schema);

            modelBuilder.Entity<ProcessedEvent>(entity =>
            {
                entity.ToTable("ProcessedEvents", _schema);
                entity.HasKey(e => e.EventId);
                entity.Property(e => e.EventType).IsRequired();
                entity.Property(e => e.ProcessedAtUtc).IsRequired();
            });
        }
    }
}

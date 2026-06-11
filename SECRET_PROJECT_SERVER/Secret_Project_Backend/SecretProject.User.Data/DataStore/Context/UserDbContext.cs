using Microsoft.EntityFrameworkCore;
using SecretProject.User.Data.DataStore.Entities;

namespace SecretProject.User.Data.DataStore.Context
{
    public class UserDbContext : DbContext
    {
        private readonly string _schema = "user";
        public UserDbContext() { }
        public UserDbContext(DbContextOptions<UserDbContext> options) : base(options) { }

        public DbSet<UserProfile> UserProfiles => Set<UserProfile>();
        public DbSet<Friendship> Friendships => Set<Friendship>();
        public DbSet<ProcessedEvent> ProcessedEvents => Set<ProcessedEvent>();

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
                throw new InvalidOperationException("AuthDbContext requires externally configured DbContextOptions.");
            }
        }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.HasDefaultSchema(_schema);

            modelBuilder.Entity<UserProfile>(entity =>
            {
                entity.ToTable("UserProfiles", _schema);
                entity.HasKey(u => u.Id);
                entity.Property(u => u.Name).IsRequired();
                entity.Property(u => u.PresenceState).IsRequired();
                entity.Property(u => u.ActivationState).IsRequired();
                entity.Property(u => u.CreatedAt).IsRequired();
                entity.Property(u => u.LastSeenAt);
                entity.Property(u => u.Bio);
                entity.Property(u => u.AvatarFileId);
                entity.Property(u => u.IsMicrophoneMuted);
                entity.Property(u => u.IsHeadphonesMuted);
            });

            modelBuilder.Entity<ProcessedEvent>(entity =>
            {
                entity.ToTable("ProcessedEvents", _schema);
                entity.HasKey(e => e.EventId);
                entity.Property(e => e.EventType).IsRequired();
                entity.Property(e => e.ProcessedAtUtc).IsRequired();
            });

            modelBuilder.Entity<Friendship>(entity =>
            {
                entity.ToTable("Friendships", _schema);
                entity.HasKey(x => x.Id);
                entity.Property(x => x.UserId).IsRequired();
                entity.Property(x => x.FriendId).IsRequired();
                entity.Property(x => x.Status).IsRequired();
            });
        }
    }
}

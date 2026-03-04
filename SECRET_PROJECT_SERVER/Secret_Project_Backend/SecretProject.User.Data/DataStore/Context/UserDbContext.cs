using Microsoft.EntityFrameworkCore;
using System.Data;

namespace SecretProject.Service.User.DataStore.Context
{
    public class UserDbContext : DbContext
    {
        public UserDbContext(DbContextOptions<UserDbContext> options) : base(options) { }

        public DbSet<UserProfile> UserProfiles { get; set; }
        //public DbSet<Friendship> Friendships { get; set; }
        public DbSet<UserStatus> UserStatuses { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // UserProfile - это проекция данных из Auth Service + дополнительные поля
            modelBuilder.Entity<UserProfile>(entity =>
            {
                entity.HasKey(u => u.Id);
                entity.Property(u => u.DisplayName).IsRequired();
                entity.Property(u => u.Email).IsRequired();
                entity.HasIndex(u => u.Email).IsUnique();

                // Статус теперь отдельная сущность или Value Object
                entity.HasOne(u => u.Status)
                    .WithOne()
                    .HasForeignKey<UserStatus>(s => s.UserId);
            });

            //modelBuilder.Entity<Friendship>(entity =>
            //{
            //    entity.HasKey(f => f.Id);
            //    entity.HasIndex(f => new { f.UserId, f.FriendId }).IsUnique();

            //    // Связи только с UserProfile, не с IdentityUser!
            //    entity.HasOne(f => f.User)
            //        .WithMany(u => u.Friends)
            //        .HasForeignKey(f => f.UserId)
            //        .OnDelete(DeleteBehavior.Restrict);
            //});
        }
    }

    public class UserProfile
    {
        public string Id { get; set; } // Тот же Id, что и в Auth Service
        public string Email { get; set; }
        public string DisplayName { get; set; }
        public string? AvatarUrl { get; set; }
        public UserStatus Status { get; set; }
        //public ICollection<Friendship> Friends { get; set; }
        public DateTime LastSyncedAt { get; set; } // Для eventual consistency
    }

    public class UserStatus
    {
        public int Id { get; set; }
        public string UserId { get; set; }
        public ConnectionState State { get; set; } // Online/Offline
        public DateTime LastSeen { get; set; }
        public UserProfile User { get; set; }
    }
}

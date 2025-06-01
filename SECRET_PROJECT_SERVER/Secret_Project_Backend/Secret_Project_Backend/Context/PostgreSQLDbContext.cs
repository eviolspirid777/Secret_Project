using Microsoft.EntityFrameworkCore;
using Secret_Project_Backend.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;

namespace Secret_Project_Backend.Context
{
    public class PostgreSQLDbContext: IdentityDbContext<ApplicationUser>
    {
        public PostgreSQLDbContext(DbContextOptions<PostgreSQLDbContext> options) : base(options)
        {
            Database.EnsureCreated();
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<ApplicationUser>()
                .Property(u => u.Status)
                .HasConversion<string>();

            modelBuilder.Entity<ChannelUser>()
                .HasKey(cu => new {cu.UserId, cu.ChannelId});

            modelBuilder.Entity<ChannelUser>()
                .HasOne(cu => cu.User)
                .WithMany(u => u.ChannelUsers)
                .HasForeignKey(cu => cu.UserId);

            modelBuilder.Entity<ChannelUser>()
                .HasOne(cu => cu.Channel)
                .WithMany(c => c.ChannelUsers)
                .HasForeignKey(cu => cu.ChannelId);

            modelBuilder.Entity<Message>()
                .HasOne(m => m.Sender)
                .WithMany(s => s.Messages)
                .HasForeignKey(m => m.SenderId);

            modelBuilder.Entity<Message>()
                .HasOne(m => m.Channel)
                .WithMany(c => c.Messages)
                .HasForeignKey(m => m.ChannelId);

            // Конфигурация Friendship
            modelBuilder.Entity<Friendship>()
                .HasKey(f => f.Id);

            // Связь: User (инициатор дружбы)
            modelBuilder.Entity<Friendship>()
                .HasOne(f => f.User)
                .WithMany(u => u.Friends)
                .HasForeignKey(f => f.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            // Связь: Friend (получатель дружбы)
            modelBuilder.Entity<Friendship>()
                .HasOne(f => f.Friend)
                .WithMany(u => u.FriendOf)
                .HasForeignKey(f => f.FriendId)
                .OnDelete(DeleteBehavior.Restrict);

            // Уникальный индекс, чтобы не было дубликатов дружбы
            modelBuilder.Entity<Friendship>()
                .HasIndex(f => new { f.UserId, f.FriendId })
                .IsUnique();
        }

        public DbSet<Channel> Channels { get; set; }
        public DbSet<Message> Messages { get; set; }
        public DbSet<ChannelUser> ChannelUsers { get; set; }
        public DbSet<Friendship> Friendships { get; set; }
    }
}

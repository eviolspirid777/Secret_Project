﻿using Microsoft.EntityFrameworkCore;
using Secret_Project_Backend.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;

namespace Secret_Project_Backend.Context
{
    public class PostgreSQLDbContext : IdentityDbContext<ApplicationUser>
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
                .HasKey(cu => new { cu.UserId, cu.ChannelId });

            modelBuilder.Entity<ChannelUser>()
                .HasOne(cu => cu.User)
                .WithMany(u => u.ChannelUsers)
                .HasForeignKey(cu => cu.UserId);

            modelBuilder.Entity<ChannelUser>()
                .HasOne(cu => cu.Channel)
                .WithMany(c => c.ChannelUsers)
                .HasForeignKey(cu => cu.ChannelId);

            modelBuilder.Entity<Message>()
                .HasKey(m => m.Id);

            modelBuilder.Entity<Message>()
                .HasOne(m => m.Sender)
                .WithMany(s => s.SentMessages)
                .HasForeignKey(m => m.SenderId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Message>()
                .HasOne(m => m.Reciver)
                .WithMany(r => r.ReceivedMessages)
                .HasForeignKey(m => m.ReciverId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Message>()
                .HasOne(m => m.RepliedMessage)
                .WithMany()
                .HasForeignKey(m => m.RepliedId)
                .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<Reaction>()
                .HasOne(r => r.Message)
                .WithMany(m => m.Reactions)
                .HasForeignKey(r => r.MessageId)
                .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<Reaction>()
                .HasOne(r => r.User)
                .WithMany(u => u.Reactions)
                .HasForeignKey(r => r.UserId)
                .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<Models.File>()
                .HasOne(f => f.Message)
                .WithOne(m => m.File)
                .HasForeignKey<Models.File>(f => f.MessageId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<ChannelFile>()
                .HasOne(f => f.ChannelMessage)
                .WithOne(cm => cm.ChannelFile)
                .HasForeignKey<ChannelFile>(f => f.ChannelMessageId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<ChannelMessage>()
                .HasOne(m => m.Sender)
                .WithMany(s => s.ChannelMessages)
                .HasForeignKey(m => m.SenderId);

            modelBuilder.Entity<ChannelMessage>()
                .HasOne(m => m.Channel)
                .WithMany(c => c.ChannelMessages)
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

            modelBuilder.Entity<Channel>()
                .HasOne(c => c.Admin)
                .WithMany(a => a.ChannelsAdmin)
                .HasForeignKey(c => c.AdminId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Channel>()
                .HasOne(c => c.Room)
                .WithOne(r => r.Channel)
                .HasForeignKey<Channel>(c => c.RoomId)
                .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<UserRoom>()
                .HasOne(r => r.LeftUser)
                .WithMany(u => u.LeftRooms)
                .HasForeignKey(r => r.LeftUserId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<UserRoom>()
                .HasOne(r => r.RightUser)
                .WithMany(u => u.RightRooms)
                .HasForeignKey(r => r.RightUserId)
                .OnDelete(DeleteBehavior.Restrict);
        }

        public DbSet<Channel> Channels { get; set; }
        public DbSet<ChannelMessage> ChannelMessages { get; set; }
        public DbSet<Message> Messages { get; set; }
        public DbSet<ChannelUser> ChannelUsers { get; set; }
        public DbSet<Friendship> Friendships { get; set; }
        public DbSet<Room> Rooms { get; set; }
        public DbSet<UserRoom> UserRooms { get; set; }
        public DbSet<Reaction> Reactions { get; set; }
    }
}

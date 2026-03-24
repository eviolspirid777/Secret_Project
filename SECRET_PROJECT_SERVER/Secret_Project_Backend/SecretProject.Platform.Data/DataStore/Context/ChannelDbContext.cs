using Microsoft.EntityFrameworkCore;
using SecretProject.Platform.Data.DataStore.Entities;
using SecretProject.Platform.Data.DataStore.Models;
using System;
using System.Collections.Generic;
using System.Text;

namespace SecretProject.Platform.Data.DataStore.Context;

public class ChannelDbContext : DbContext
{
    private readonly string _schema = "channel";

    public ChannelDbContext(DbContextOptions<ChannelDbContext> options) : base(options)
    {
    }

    public ChannelDbContext()
    {
    }

    public DbSet<Channel> Channels => Set<Channel>();
    public DbSet<ChannelMessage> ChannelMessages => Set<ChannelMessage>();
    public DbSet<Message> Messages => Set<Message>();
    public DbSet<ChannelUser> ChannelUsers => Set<ChannelUser>();
    public DbSet<ChannelFile> ChannelFiles => Set<ChannelFile>(); // Добавлено

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        if (!optionsBuilder.IsConfigured)
        {
            var connectionString = "Host=localhost;Port=5432;Database=SecretProject;Username=postgres;Password=sas07291mem;";

            optionsBuilder.UseNpgsql(connectionString, npgsqlOptions =>
            {
                npgsqlOptions.MigrationsHistoryTable("__EFMigrationsHistory", _schema);
            });
        }
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.HasDefaultSchema(_schema);

        modelBuilder.Entity<Channel>(entity =>
        {
            entity.ToTable("Channels", _schema);

            entity.HasKey(c => c.Id);

            entity.HasOne(c => c.Room)
                .WithOne(r => r.Channel)
                .HasForeignKey<Channel>(c => c.RoomId)
                .OnDelete(DeleteBehavior.SetNull);

            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP");

            entity.HasMany(c => c.ChannelMessages)
                .WithOne(cm => cm.Channel)
                .HasForeignKey(cm => cm.ChannelId);
        });

        modelBuilder.Entity<ChannelMessage>(entity =>
        {
            entity.ToTable("ChannelMessages", _schema);

            entity.HasKey(e => e.Id);

            entity.Property(e => e.SentAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP");

            entity.HasOne(cm => cm.Channel)
                .WithMany(c => c.ChannelMessages)
                .HasForeignKey(cm => cm.ChannelId);
        });

        modelBuilder.Entity<Message>(entity =>
        {
            entity.ToTable("Messages", _schema);

            entity.HasKey(e => e.Id);

            entity.Property(e => e.SentAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP");
        });

        modelBuilder.Entity<ChannelUser>(entity =>
        {
            entity.ToTable("ChannelUsers", _schema);

            entity.HasKey(cu => new { cu.UserId, cu.ChannelId });
        });

        modelBuilder.Entity<ChannelFile>(entity =>
        {
            entity.ToTable("ChannelFiles", _schema);

            entity.HasKey(f => f.Id);

            entity.HasOne(f => f.ChannelMessage)
                .WithOne(cm => cm.ChannelFile)
                .HasForeignKey<ChannelFile>(f => f.ChannelMessageId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // Конфигурация File
        modelBuilder.Entity<Models.File>(entity =>
        {
            entity.ToTable("Files", _schema);

            entity.HasKey(f => f.Id);

            entity.HasOne(f => f.Message)
                .WithOne(m => m.File)
                .HasForeignKey<Models.File>(f => f.MessageId)
                .OnDelete(DeleteBehavior.Cascade);
        });
    }
}
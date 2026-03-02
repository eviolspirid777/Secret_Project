using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using SecretProject.Authentication.Data.DataStore.Entities;
using System.Collections.Generic;
using System.Reflection.Emit;

namespace SecretProject.Authentication.Data.DataStore.Context;

public class AuthDbContext : IdentityDbContext<AuthUser>
{
    public AuthDbContext(DbContextOptions<AuthDbContext> options) : base(options)
    {
        Database.EnsureCreated(); // В production используйте миграции!
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Только базовые настройки Identity
        // Никаких связей с другими сущностями!

        // Оставляем только самые необходимые индексы
        modelBuilder.Entity<AuthUser>(entity =>
        {
            entity.HasIndex(u => u.Email).IsUnique();
            // Убираем все навигационные свойства, которых больше нет
            entity.Ignore(u => u.Status);
            entity.Ignore(u => u.ChannelUsers);
            entity.Ignore(u => u.Friends);
            entity.Ignore(u => u.SentMessages);
            entity.Ignore(u => u.ReceivedMessages);
            // ... и так далее
        });
    }

    // Только Identity-related DbSet
    public DbSet<AuthUser> Users { get; set; }
    // Все остальные DbSet убираем!
}

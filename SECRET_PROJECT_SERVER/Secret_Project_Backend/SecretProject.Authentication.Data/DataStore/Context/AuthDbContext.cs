using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using SecretProject.Authentication.Data.DataStore.Entities;


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
        modelBuilder.Entity<AuthUser>();
    }

    // Только Identity-related DbSet
    public DbSet<AuthUser> Users { get; set; }
    // Все остальные DbSet убираем!
}

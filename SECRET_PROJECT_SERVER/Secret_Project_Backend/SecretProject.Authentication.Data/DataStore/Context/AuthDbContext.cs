using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using SecretProject.Authentication.Data.DataStore.Entities;

namespace SecretProject.Authentication.Data.DataStore.Context;

public class AuthDbContext : IdentityDbContext<AuthUser, IdentityRole<Guid>, Guid>
{
    private readonly string _schema = "authentication";
    public AuthDbContext() { }
    public AuthDbContext(DbContextOptions<AuthDbContext> options) : base(options) { }
    public DbSet<AuthUser> AuthUsers => Set<AuthUser>();
    public DbSet<OutboxMessage> OutboxMessages => Set<OutboxMessage>();

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        if (!optionsBuilder.IsConfigured)
        {
            throw new InvalidOperationException("AuthDbContext требует заранее прописанных DbContextOptions.");
        }
    }
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.HasDefaultSchema(_schema);
        modelBuilder.Entity<AuthUser>(entity =>
        {
            entity.ToTable("Users", _schema);
        });

        modelBuilder.Entity<IdentityUserClaim<Guid>>(entity =>
        {
            entity.ToTable("UserClaims", _schema);
        });

        modelBuilder.Entity<IdentityUserLogin<Guid>>(entity =>
        {
            entity.ToTable("UserLogins", _schema);
        });

        modelBuilder.Entity<IdentityUserToken<Guid>>(entity =>
        {
            entity.ToTable("UserTokens", _schema);
        });

        modelBuilder.Entity<IdentityRole<Guid>>(entity =>
        {
            entity.ToTable("Roles", _schema);
        });

        modelBuilder.Entity<IdentityRoleClaim<Guid>>(entity =>
        {
            entity.ToTable("RoleClaims", _schema);
        });

        modelBuilder.Entity<IdentityUserRole<Guid>>(entity =>
        {
            entity.ToTable("UserRoles", _schema);
        });

        modelBuilder.Entity<OutboxMessage>(entity =>
        {
            entity.ToTable("OutboxMessages", _schema);
            entity.HasKey(x => x.Id);
            entity.Property(x => x.Type).IsRequired();
            entity.Property(x => x.Payload).IsRequired();
            entity.Property(x => x.OccurredAtUtc).IsRequired();
            entity.Property(x => x.ProcessedAtUtc);
            entity.Property(x => x.Error);
        });
    }
}

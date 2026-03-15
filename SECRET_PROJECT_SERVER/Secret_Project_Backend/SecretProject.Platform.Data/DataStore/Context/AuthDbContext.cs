using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using SecretProject.Platform.Data.DataStore.Entities;
using SecretProject.Platform.Data.DataStore.Models;

namespace SecretProject.Platform.Data.DataStore.Context
{
    public class AuthDbContext : IdentityDbContext<AuthUser>
    {
        private readonly string _schema = "authentication";
        public AuthDbContext() { }
        public AuthDbContext(DbContextOptions<AuthDbContext> options) : base(options) { }
        public DbSet<AuthUser> AuthUsers => Set<AuthUser>();

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
                // Важно: эта строка используется ТОЛЬКО для миграций!
                // В реальном приложении конфигурация идет через AddDbContext в Program.cs
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
            modelBuilder.Entity<AuthUser>(entity =>
            {
                entity.ToTable("Users", _schema);

                entity.Property(e => e.DisplayName)
                    .IsRequired()
                    .HasMaxLength(256);

                entity.Property(e => e.AvatarUrl)
                    .HasMaxLength(2048);

                entity.Property(e => e.CreatedAt)
                    .HasDefaultValueSql("CURRENT_TIMESTAMP");
            });

            modelBuilder.Entity<IdentityUserClaim<string>>(entity =>
            {
                entity.ToTable("UserClaims", _schema);
            });

            modelBuilder.Entity<IdentityUserLogin<string>>(entity =>
            {
                entity.ToTable("UserLogins", _schema);
            });

            modelBuilder.Entity<IdentityUserToken<string>>(entity =>
            {
                entity.ToTable("UserTokens", _schema);
            });

            modelBuilder.Entity<IdentityRole>(entity =>
            {
                entity.ToTable("Roles", _schema);
            });

            modelBuilder.Entity<IdentityRoleClaim<string>>(entity =>
            {
                entity.ToTable("RoleClaims", _schema);
            });

            modelBuilder.Entity<IdentityUserRole<string>>(entity =>
            {
                entity.ToTable("UserRoles", _schema);
            });

            modelBuilder.Entity<AuthUser>()
                .HasIndex(u => u.DisplayName)
                .HasDatabaseName("IX_Users_DisplayName");
        }
    }
}

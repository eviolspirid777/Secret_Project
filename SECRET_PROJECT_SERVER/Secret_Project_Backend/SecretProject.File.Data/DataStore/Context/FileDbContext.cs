using Microsoft.EntityFrameworkCore;
using SecretProject.File.Data.DataStore.Entities;

namespace SecretProject.File.Data.DataStore.Context
{
    public sealed class FileDbContext : DbContext
    {
        private readonly string _schema = "file";
        public FileDbContext() { }
        public FileDbContext(DbContextOptions<FileDbContext> options) : base(options) { }

        public DbSet<FileMetadata> Files => Set<FileMetadata>();
        public DbSet<OutboxMessage> OutboxMessages => Set<OutboxMessage>();

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
                throw new InvalidOperationException("FileDbContext требует заранее прописанных DbContextOptions.");
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.HasDefaultSchema(_schema);
            modelBuilder.Entity<FileMetadata>(entity =>
            {
                entity.ToTable("Files", _schema);
                entity.HasIndex(x => x.OwnerUserId);
                entity.HasIndex(x => x.Status);
                entity.HasIndex(x => x.UploadExpiresAtUtc);
                entity.HasIndex(x => x.ObjectKey).IsUnique();
            });
            modelBuilder.Entity<OutboxMessage>(entity =>
            {
                entity.ToTable("OutboxMessages", _schema);
            });

        }
    }
}

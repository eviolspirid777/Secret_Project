using SecretProject.Platform.Data.DataStore.Models;

namespace SecretProject.Platform.Data.DataStore.Context
{
    //public class PlatformDbContext : DbContext
    //{
    //    public PlatformDbContext(DbContextOptions<PlatformDbContext> options) : base(options) { }

    //    public DbSet<Channel> Channels { get; set; }
    //    public DbSet<Message> Messages { get; set; }
    //    public DbSet<ChannelMessage> ChannelMessages { get; set; }
    //    public DbSet<ChannelUser> ChannelUsers { get; set; }
    //    public DbSet<Room> Rooms { get; set; }
    //    public DbSet<UserRoom> UserRooms { get; set; }
    //    public DbSet<Reaction> Reactions { get; set; }
    //    public DbSet<Models.File> Files { get; set; }

    //    protected override void OnModelCreating(ModelBuilder modelBuilder)
    //    {
    //        base.OnModelCreating(modelBuilder);

    //        // Здесь мы работаем с UserId как string, но без FK в БД!
    //        // Это важно - мы не создаем внешние ключи на несуществующую таблицу Users

    //        modelBuilder.Entity<Channel>(entity =>
    //        {
    //            entity.HasKey(c => c.Id);

    //            // AdminId - это просто string, без FK
    //            entity.Property(c => c.AdminId).IsRequired();

    //            // Индекс для быстрого поиска по админу
    //            entity.HasIndex(c => c.AdminId);
    //        });

    //        modelBuilder.Entity<Message>(entity =>
    //        {
    //            entity.HasKey(m => m.Id);

    //            // SenderId и ReceiverId - просто строки, без FK
    //            entity.Property(m => m.SenderId).IsRequired();
    //            entity.Property(m => m.ReceiverId).IsRequired();

    //            // Индексы для быстрого поиска сообщений пользователя
    //            entity.HasIndex(m => m.SenderId);
    //            entity.HasIndex(m => m.ReceiverId);
    //            entity.HasIndex(m => new { m.SenderId, m.ReceiverId });

    //            // Связи с File и Reaction остаются, так как это внутри сервиса
    //            entity.HasOne(m => m.File)
    //                .WithOne(f => f.Message)
    //                .HasForeignKey<Models.File>(f => f.MessageId);
    //        });

    //        modelBuilder.Entity<ChannelUser>(entity =>
    //        {
    //            entity.HasKey(cu => new { cu.UserId, cu.ChannelId });

    //            // UserId - просто строка
    //            entity.HasIndex(cu => cu.UserId);

    //            // Связь с Channel внутри сервиса
    //            entity.HasOne(cu => cu.Channel)
    //                .WithMany(c => c.ChannelUsers)
    //                .HasForeignKey(cu => cu.ChannelId);
    //        });

    //        // Аналогично для остальных сущностей
    //    }
    //}
}

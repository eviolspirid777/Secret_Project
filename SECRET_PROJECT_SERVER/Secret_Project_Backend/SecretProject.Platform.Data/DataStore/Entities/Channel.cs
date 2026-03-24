using SecretProject.Platform.Data.DataStore.Models;

namespace SecretProject.Platform.Data.DataStore.Entities
{
    public class Channel
    {
        public required Guid Id { get; set; }
        public required string Name { get; set; } = string.Empty;
        public string? ChannelAvatarUrl { get; set; }
        public required DateTime CreatedAt { get; set; }
        public Guid? AdminId { get; set; }
        //public ApplicationUser? Admin { get; set; }
        public Guid? RoomId { get; set; }
        public Room? Room { get; set; }
        public virtual ICollection<ChannelMessage>? ChannelMessages { get; set; }
        public virtual ICollection<ChannelUser>? ChannelUsers { get; set; }
    }
}

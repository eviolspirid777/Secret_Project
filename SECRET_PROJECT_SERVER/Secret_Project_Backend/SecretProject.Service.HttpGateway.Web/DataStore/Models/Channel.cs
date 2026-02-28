namespace SecretProject.Service.HttpGateway.Web.DataStore.Models;
public class Channel
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string ChannelAvatarUrl { get; set; }
    public DateTime CreatedAt { get; set; }
    public string? AdminId { get; set; }
    public ApplicationUser? Admin { get; set; }

    public Guid? RoomId { get; set; }
    public Room? Room { get; set; }

    public virtual ICollection<ChannelMessage> ChannelMessages { get; set; }
    public virtual ICollection<ChannelUser> ChannelUsers { get; set; }
}


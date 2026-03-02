using System.ComponentModel.DataAnnotations;

namespace SecretProject.Service.HttpGateway.Web.DataStore.Models;

public class Room
{
    [Key]
    public Guid Id { get; set; }
    public Guid[] MutedAudioUserIds { get; set; }
    public Guid[] MutedVideoUserIds { get; set; }
    public Guid[] BlockedUsers { get; set; }

    public Guid? ChannelId { get; set; }
    public Channel? Channel { get; set; }
}

using System.ComponentModel.DataAnnotations;

namespace SecretProject.Service.HttpGateway.Web.DataStore.Models;

public class UserRoom
{
    [Key]
    public Guid Id { get; set; }
    public Guid[]? MutedAudioUserIds { get; set; }
    public Guid[]? MutedVideoUserIds { get; set; }
    public string? LeftUserId { get; set; }
    public ApplicationUser? LeftUser { get; set; }
    public string? RightUserId { get; set; }
    public ApplicationUser? RightUser { get; set; }
}

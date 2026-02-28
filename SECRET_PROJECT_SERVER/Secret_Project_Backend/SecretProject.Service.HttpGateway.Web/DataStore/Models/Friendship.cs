namespace SecretProject.Service.HttpGateway.Web.DataStore.Models;

public enum FriendshipStatus
{
    Pending,
    Accepted,
    Blocked
}
public class Friendship
{
    public string Id { get; set; }
    public string UserId { get; set; }
    public ApplicationUser User { get; set; }

    public string FriendId { get; set; }
    public ApplicationUser Friend { get; set; }

    public FriendshipStatus Status { get; set; }
}

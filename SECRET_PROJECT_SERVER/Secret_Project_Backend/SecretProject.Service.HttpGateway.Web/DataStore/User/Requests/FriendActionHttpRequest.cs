namespace SecretProject.Service.HttpGateway.Web.DataStore.User.Requests;

public sealed class FriendActionHttpRequest
{
    public required string FromUserId { get; set; }
    public required string ToUserId { get; set; }
}

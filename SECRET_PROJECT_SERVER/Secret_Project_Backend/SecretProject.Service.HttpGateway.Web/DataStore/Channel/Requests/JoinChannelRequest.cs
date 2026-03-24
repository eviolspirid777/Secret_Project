namespace SecretProject.Service.HttpGateway.Web.DataStore.Channel.Requests
{
    public class JoinChannelRequest
    {
        public required string UserId { get; set; }
        public required Guid ChannelId { get; set; }
    }
}

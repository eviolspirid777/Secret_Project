namespace SecretProject.Service.HttpGateway.Web.DataStore.Channel.Requests
{
    public class AddNewChannelRequest
    {
        public required string Name { get; set; }
        public string? ChannelAvatarUrl { get; set; }
        public required string AdminId { get; set; }
    }
}

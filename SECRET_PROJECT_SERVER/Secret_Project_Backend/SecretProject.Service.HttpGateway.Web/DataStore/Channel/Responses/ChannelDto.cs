namespace SecretProject.Service.HttpGateway.Web.DataStore.Channel.Responses;

public class ChannelDto
{
    public string Id { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string ChannelAvatarUrl { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}

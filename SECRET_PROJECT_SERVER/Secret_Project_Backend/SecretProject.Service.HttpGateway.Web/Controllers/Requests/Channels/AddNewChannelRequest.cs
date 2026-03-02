namespace SecretProject.Service.HttpGateway.Web.Controllers.Requests;

public class AddNewChannelRequest
{
    public string Name { get; set; }
    public string ChannelAvatarUrl { get; set; }
    public string AdminId { get; set; }
}

namespace SecretProject.Service.HttpGateway.Web.Controllers.Requests;

public class ChannelMessageDeleteRequest
{
    public Guid ChannelId { get; set;}
    public Guid MessageId { get; set;}
}

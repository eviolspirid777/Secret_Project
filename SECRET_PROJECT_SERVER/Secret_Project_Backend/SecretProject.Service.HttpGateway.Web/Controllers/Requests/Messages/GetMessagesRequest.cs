namespace SecretProject.Service.HttpGateway.Web.Controllers.Requests;

public class GetMessagesRequest
{
    public string FirstUserId { get; set; }
    public string SecondUserId { get; set; }
    public int Page { get; set; }
}

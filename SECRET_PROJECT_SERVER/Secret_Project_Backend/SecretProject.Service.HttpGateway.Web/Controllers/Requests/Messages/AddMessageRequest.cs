namespace SecretProject.Service.HttpGateway.Web.Controllers.Requests;

public class AddMessageRequest
{
    public string SenderId { get; set; }
    public string ReciverId { get; set; }
    public string? Content { get; set; }
    public IFormFile? File { get; set; }
    public string? FileType { get; set; }
    public string? FileName { get; set; }
    public Guid? RepliedMessageId { get; set; }
}

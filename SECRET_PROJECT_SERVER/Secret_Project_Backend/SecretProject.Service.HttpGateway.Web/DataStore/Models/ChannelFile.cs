using System.ComponentModel.DataAnnotations;

namespace SecretProject.Service.HttpGateway.Web.DataStore.Models;
public class ChannelFile
{
    [Key]
    public Guid Id { get; set; }
    public string FileUrl { get; set; }
    public string FileType { get; set; }
    public string FileName { get; set; }

    public Guid ChannelMessageId { get; set; }
    public virtual ChannelMessage ChannelMessage { get; set; }
}
    

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SecretProject.Service.HttpGateway.Web.Controllers.Requests;

public class JoinChannelRequest
{
    public string UserId { get; set; }
    public Guid ChannelId { get; set; }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SecretProject.Service.HttpGateway.Web.Controllers.Requests;

public class DeleteMessageRequest
{
    public Guid MessageId { get; set; }
    public bool ForAllUsers { get; set; }
}

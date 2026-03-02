using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SecretProject.Service.HttpGateway.Web.Controllers.Requests;

public class ChangeUserAvatarRequest
{
    public Guid UserId { get; set; }
    public IFormFile File { get; set; }
}

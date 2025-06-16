using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Secret_Project_Backend.Controllers.Requests.User
{
    public class ChangeUserAvatarRequest
    {
        public Guid UserId { get; set; }
        public IFormFile File { get; set; }
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Secret_Project_Backend.Controllers.Requests.Channels
{
    public class JoinChannelRequest
    {
        public string UserId { get; set; }
        public Guid ChannelId { get; set; }
    }
}

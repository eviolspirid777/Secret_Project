using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Secret_Project_Backend.Controllers.Requests.Channels
{
    public class AddNewChannelRequest
    {
        public string Name { get; set; }
        public string ChannelAvatarUrl { get; set; }
    }
}

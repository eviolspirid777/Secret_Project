using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Secret_Project_Backend.Controllers.Requests.ChannelMessages
{
    public class AddChannelMessageRequest
    {
        public string? Content { get; set; }
        public string SenderId { get; set; }
        public Guid ChannelId { get; set; }
        public IFormFile? File { get; set; }
        public string? FileType { get; set; }
        public string? FileName { get; set; }
    }
}

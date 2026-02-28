using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Secret_Project_Backend.Controllers.Requests.Messages
{
    public class DeleteMessageRequest
    {
        public Guid MessageId { get; set; }
        public bool ForAllUsers { get; set; }
    }
}

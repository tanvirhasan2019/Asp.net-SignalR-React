using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ChatWithSignalR.Models
{
    public class Message
    {
        public int MessageId { get; set; }

        public string Username { get; set; }

        public string Messages { get; set; }
    }
}

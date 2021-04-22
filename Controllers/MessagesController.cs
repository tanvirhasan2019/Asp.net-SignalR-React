
using ChatWithSignalR.Data;
using ChatWithSignalR.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ChatWithSignalR.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class MessagesController : ControllerBase
    {
      
       
            private readonly ILogger<MessagesController> _logger;
            private readonly IHubContext<SignalRService> _SignalRHub;
            private readonly ApplicationDbContext _context;
            public MessagesController(ApplicationDbContext context, ILogger<MessagesController> logger, IHubContext<SignalRService> SignalRHub)
            {
                _logger = logger;
                _SignalRHub = SignalRHub;
                _context = context;
            }

        public MessagesController(ILogger<MessagesController> logger, IHubContext<SignalRService> signalRHub, ApplicationDbContext context)
        {
            _logger = logger;
            _SignalRHub = signalRHub;
            _context = context;
        }

        [HttpPost]
        [Route("CreateMessage")]
        public IActionResult CreateMessage([FromBody] Message message)
        {

            _context.Messages.Add(message);
            _context.SaveChanges();
            _SignalRHub.Clients.All.SendAsync("LoadMessages");

            return Ok(new { status = "OK" });

        }


            [HttpGet]
            [Route("GetAllMessage")]
            public IActionResult GetAllMessage()
            {


                var MessageList = _context.Messages.ToList();
                return Ok(new { MessageList = MessageList });




            }
        }
    
}

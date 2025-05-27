using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Secret_Project_Backend.Context;
using Secret_Project_Backend.Controllers.Requests.Messages;
using Secret_Project_Backend.DTOs;
using Secret_Project_Backend.Mappers.Messages;

namespace Secret_Project_Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MessageController : ControllerBase
    {
        private readonly PostgreSQLDbContext _dbContext;
        public MessageController(
            PostgreSQLDbContext dbContext
        )
        {
            _dbContext = dbContext;
        }

        [HttpPost]
        public async Task<IActionResult> AddMessage(MessageAddRequest data)
        {
            var channel = await _dbContext.Channels.FindAsync(data.ChannelId);
            if(channel == null)
            {
                return BadRequest("InvalidChannelId");
            }
            foreach(var message in data.Messages)
            {
                var mappedMessage = MessagesMapper.MessageDtoToMessage(message);
                channel.Messages.Add(mappedMessage);
            }

            await _dbContext.SaveChangesAsync();
            return Ok();
        }

        [HttpDelete]
        public async Task<IActionResult> DeleteMessage(MessageDeleteRequest data)
        {
            var channel = await _dbContext.Channels.FindAsync(data.ChannelId);
            if(channel == null)
            {
                return BadRequest("InvalidChannelId");
            }
            var message = channel.Messages.FirstOrDefault(item => item.Id == data.MessageId);
            if(message == null)
            {
                return BadRequest("InvalidMessage");
            }
            channel.Messages.Remove(message);
            await _dbContext.SaveChangesAsync();
            return Ok(data.MessageId);
        }
    }
}

using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Secret_Project_Backend.Context;
using Secret_Project_Backend.Controllers.Requests.Messages;
using Secret_Project_Backend.DTOs;
using Secret_Project_Backend.Mappers.Messages;

namespace Secret_Project_Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ChannelMessageController : ControllerBase
    {
        private readonly PostgreSQLDbContext _dbContext;

        public ChannelMessageController(
            PostgreSQLDbContext dbContext
        )
        {
            _dbContext = dbContext;
        }

        [HttpGet("get-channel-users")]
        public async Task<IActionResult> GetChannelUsers([FromQuery] Guid id)
        {
            var channel = await _dbContext
                .Channels
                .Include(c => c.ChannelUsers)
                .FirstOrDefaultAsync(c => c.Id == id);

            if(channel == null)
            {
                return NotFound();
            }

            var users = channel.ChannelUsers.Select(ChannelMessagesMapper.MapChannelUserToChannelUserDto);

            return Ok(users);
        }

        [HttpGet("get-channel-messages")]
        public async Task<IActionResult> GetChannelMessages([FromQuery] Guid id)
        {

            var channel = await _dbContext
                .Channels
                .Include(c => c.ChannelMessages)
                .FirstOrDefaultAsync(c => c.Id == id);

            if(channel == null)
            {
                return NotFound();
            }

            return Ok();
        }

        [HttpPost("add-channel-message")]
        public async Task<IActionResult> AddChannelMessage(ChannelMessageAddRequest data)
        {
            var channel = await _dbContext.Channels.FindAsync(data.ChannelId);
            if(channel == null)
            {
                return BadRequest("InvalidChannelId");
            }

            var mappedMessage = ChannelMessagesMapper.MapChannelMessageDtoToChannelMessage(data.Message);
            channel.ChannelMessages.Add(mappedMessage);

            await _dbContext.SaveChangesAsync();
            return Ok();
        }

        [HttpPost("delete-channel-message")]
        public async Task<IActionResult> DeleteChannelMessage(ChannelMessageDeleteRequest data)
        {
            var channel = await _dbContext.Channels.FindAsync(data.ChannelId);
            if(channel == null)
            {
                return BadRequest("InvalidChannelId");
            }
            var message = channel.ChannelMessages.FirstOrDefault(item => item.Id == data.MessageId);
            if(message == null)
            {
                return BadRequest("InvalidMessage");
            }
            channel.ChannelMessages.Remove(message);
            await _dbContext.SaveChangesAsync();
            return Ok(data.MessageId);
        }
    }
}

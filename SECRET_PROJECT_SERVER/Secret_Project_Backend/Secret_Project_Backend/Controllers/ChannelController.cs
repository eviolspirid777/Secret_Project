using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Secret_Project_Backend.Context;
using Secret_Project_Backend.Controllers.Requests.Channels;
using Secret_Project_Backend.DTOs;
using Secret_Project_Backend.Mappers.Channel;

namespace Secret_Project_Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ChannelController : ControllerBase
    {
        private readonly PostgreSQLDbContext _dbContext;
        public ChannelController(
            PostgreSQLDbContext dbContext    
        )
        {
            _dbContext = dbContext;
        }
        #region Channel
        [HttpGet("get-channels/{userId}")]
        public async Task<IActionResult> Get(string userId)
        {
            var user = await _dbContext
                .Users
                .AsNoTracking()
                .Include(u => u.ChannelUsers)
                .FirstOrDefaultAsync(u => u.Id == userId);

            if(user == null)
            {
                return NotFound();
            }

            var channels = await _dbContext
                                    .Channels
                                    .AsNoTracking()
                                    .Where(ch => ch.ChannelUsers.Any(chu => chu.UserId == userId))
                                    .ToListAsync();

            var mappedChannels = channels.Select(ChannelMapper.ChannelToChannelDto);

            var channelsDictionary = new Dictionary<string, ChannelDto>();

            foreach (var channel in mappedChannels)
            {
                channelsDictionary.Add(channel.Id, channel);
            }

            return Ok(channelsDictionary);
        }

        [HttpPost("add-channel")]
        public async Task<IActionResult> AddChannel(AddNewChannelRequest data)
        {

            var channelEntity =  await _dbContext.Channels.AddAsync(new Models.Channel()
            {
                Name = data.Name,
                ChannelAvatarUrl = data.ChannelAvatarUrl
            });
            await _dbContext.SaveChangesAsync();

            return Ok(channelEntity.Entity.Id);
        }

        [HttpPost("delete-channel")]
        public async Task<IActionResult> DeleteChannel(Guid id)
        {
            var channel = await _dbContext.Channels.FindAsync(id);
            if (channel == null)
            {
                return BadRequest("Invalid Id");
            }
            _dbContext.Channels.Remove(channel);
            await _dbContext.SaveChangesAsync();

            return Ok(channel.Id);
        }
        #endregion Channel

        #region ChannelUser
        [HttpGet("channel/{id}/get-channel-users")]
        public async Task<IActionResult> GetChannelUsers(Guid id)
        {
            var channel = await _dbContext
                .Channels
                .Include(c => c.ChannelUsers)
                .FirstOrDefaultAsync(c => c.Id == id);

            var ids = channel.ChannelUsers.Select(cu => cu.UserId);

            if (channel == null)
            {
                return NotFound();
            }

            var usersTest = await _dbContext.Users.Where(u => ids.Any(id => id == u.Id)).ToListAsync();

            var users = channel
                .ChannelUsers
                .Select(ChannelMapper.MapChannelUserToChannelUserDto);

            return Ok(users);
        }

        [HttpPost("channel/{channelId}/add-user")]
        public async Task<IActionResult> AddUserToChannel([FromRoute] Guid channelId, [FromBody]AddNewUserToChannelRequest data)
        {
            var channelExist = await _dbContext.Channels.AnyAsync(c => c.Id == channelId);
            var userExist = await _dbContext.Users.AnyAsync(u => u.Id == data.UserId);

            if (!userExist && !channelExist)
            {
                return BadRequest("Bad request!");
            }

            var userAlreadyJoined = await _dbContext.ChannelUsers.AnyAsync(cu => cu.UserId == data.UserId && cu.ChannelId == channelId);
            if(userAlreadyJoined)
            {
                return BadRequest("User already joined");
            }

            await _dbContext.ChannelUsers.AddAsync(new Models.ChannelUser
            {
                ChannelId = channelId,
                UserId = data.UserId,
            });

            await _dbContext.SaveChangesAsync();
            return Ok();
        }

        [HttpPost("channel/{channelId}/delete-user/{userId}")]
        public async Task<IActionResult> DeleteUserFromChannel([FromRoute] Guid channelId, [FromRoute] string userId)
        {
            var channelUser = await _dbContext
                .ChannelUsers
                .FirstOrDefaultAsync(cu => cu.ChannelId == channelId &&  cu.UserId == userId);

            if(channelUser == null)
            {
                return NotFound();
            }

            _dbContext.ChannelUsers.Remove(channelUser);

            await _dbContext.SaveChangesAsync();
            return Ok();
        }
        #endregion ChannelUser
    }
}

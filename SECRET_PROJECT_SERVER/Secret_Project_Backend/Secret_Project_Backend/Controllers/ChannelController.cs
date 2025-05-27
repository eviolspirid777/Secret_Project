using System.Data.Entity;
using System.Threading.Channels;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Secret_Project_Backend.Context;
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

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var channels = await _dbContext
                                    .Channels
                                    .AsNoTracking()
                                    .ToListAsync();
            return Ok(channels);
        }

        [HttpPost]
        public async Task<IActionResult> AddChannel(ChannelDto data)
        {
            var newData = ChannelMapper.ChannelDtoToChannelCustom(data);
            _dbContext.Channels.Add(newData);
            await _dbContext.SaveChangesAsync();

            return Ok(newData);
        }

        [HttpDelete]
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
    }
}

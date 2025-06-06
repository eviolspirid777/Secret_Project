using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Secret_Project_Backend.Context;
using Secret_Project_Backend.Controllers.Requests.Messages;
using Secret_Project_Backend.Models;
using Secret_Project_Backend.Utils.FriendsParserFunc;
using System.Linq.Expressions;
using static System.Runtime.InteropServices.JavaScript.JSType;

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

        [HttpGet("get-messages")]
        public async Task<IActionResult> GetMessages([FromBody] GetMessagesRequest data)
        {
            var messagesQuerable = _dbContext
                .Messages
                .AsNoTracking()
                .AsQueryable();

            var isAnyMessages = await messagesQuerable
                    .AnyAsync(FriendsParserFunc.FriendsFunc(data));

            if (!isAnyMessages)
            {
                return NotFound();
            }

            var messages = await messagesQuerable
                    .Where(FriendsParserFunc.FriendsFunc(data))
                    .ToListAsync();

            return Ok(messages);
        }

        [HttpPost("add-message")]
        public async Task<IActionResult> AddMessage([FromBody] AddMessageRequest data)
        {
            if(data.SenderId == null || data.ReciverId == null || string.IsNullOrEmpty(data.Content))
            {
                return BadRequest("Данные неправильные!");
            }

            await _dbContext.Messages.AddAsync(new Models.Message()
            {
                ReciverId = data.ReciverId,
                SenderId = data.SenderId,
                Content = data.Content,
                SentAt = DateTime.Now,
            });

            await _dbContext.SaveChangesAsync();
            return Ok();
        }

        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> DeleteMessage([FromRoute] Guid id)
        {
            var message = await _dbContext.Messages.FirstOrDefaultAsync(m => m.Id == id);
            if(message == null)
            {
                return BadRequest("Invalid message id");
            }

            _dbContext.Messages.Remove(message);
            await _dbContext.SaveChangesAsync();
            return Ok();
        }
    }
}

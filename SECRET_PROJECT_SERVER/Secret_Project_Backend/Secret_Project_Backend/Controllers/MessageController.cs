using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Secret_Project_Backend.Context;
using Secret_Project_Backend.Controllers.Requests.Messages;
using Secret_Project_Backend.DTOs.Messages;
using Secret_Project_Backend.Mappers.Messages;
using Secret_Project_Backend.Services.Chat;
using Secret_Project_Backend.Utils.FriendsParserFunc;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace Secret_Project_Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MessageController : ControllerBase
    {
        private readonly PostgreSQLDbContext _dbContext;
        private readonly MessageService _messageService;

        public MessageController(
            PostgreSQLDbContext dbContext,
            MessageService messageService
        )
        {
            _dbContext = dbContext;
            _messageService = messageService;
        }

        [HttpPost("get-messages")]
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

            var mappedMessages = messages.Select(MessageMapper.MapMessageToMessageDto);

            return Ok(mappedMessages);
        }

        [HttpPost("add-message")]
        public async Task<IActionResult> AddMessage([FromBody] AddMessageRequest data)
        {
            if(data.SenderId == null || data.ReciverId == null || string.IsNullOrEmpty(data.Content))
            {
                return BadRequest("Данные неправильные!");
            }

            var message = new Models.Message()
            {
                ReciverId = data.ReciverId,
                SenderId = data.SenderId,
                Content = data.Content,
                SentAt = DateTime.UtcNow,
            };

            await _dbContext.Messages.AddAsync(message);
            await _dbContext.SaveChangesAsync();

            var messageDto = MessageMapper.MapMessageToMessageDto(message);

            await _messageService.NotifyUserAsync(data.SenderId, messageDto);
            await _messageService.NotifyUserAsync(data.ReciverId, messageDto);

            return Ok(messageDto);
        }

        [HttpPost("delete")]
        public async Task<IActionResult> DeleteMessage([FromBody] DeleteMessageRequest data)
        {
            var message = await _dbContext.Messages.FirstOrDefaultAsync(m => m.Id == data.MessageId);
            if(message == null)
            {
                return BadRequest("Invalid message id");
            }

            _dbContext.Messages.Remove(message);
            await _dbContext.SaveChangesAsync();

            await _messageService.NotifyUserAboutMessageDeleteAsync(message.SenderId, message.Id);
            //TODO: Этот механизм все равно удаляет с бд данные, поэтому нужно еще посмотреть что придумать
            //if(data.ForAllUsers)
            //{
                await _messageService.NotifyUserAboutMessageDeleteAsync(message.ReciverId, message.Id);
            //}

            return Ok();
        }
    }
}

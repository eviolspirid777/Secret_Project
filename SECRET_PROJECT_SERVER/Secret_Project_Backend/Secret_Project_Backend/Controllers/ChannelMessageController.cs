using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Secret_Project_Backend.Context;
using Secret_Project_Backend.Controllers.Requests.Messages;
using Secret_Project_Backend.Mappers.Messages;
using Secret_Project_Backend.Services.ChannelChat;
using Secret_Project_Backend.Services.S3;
using Secret_Project_Backend.SignalR;

namespace Secret_Project_Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ChannelMessageController : ControllerBase
    {
        private readonly PostgreSQLDbContext _dbContext;
        private readonly S3ServiceMessages _s3MessagesService;
        private readonly ChannelChatSignlaRService _channelMessageHub;

        public ChannelMessageController(
            PostgreSQLDbContext dbContext,
            S3ServiceMessages s3MessagesService,
            ChannelChatSignlaRService channelMessageHub
        )
        {
            _dbContext = dbContext;
            _s3MessagesService = s3MessagesService;
            _channelMessageHub = channelMessageHub;
        }

        [HttpGet("get-channel-messages/{channelId}")]
        public async Task<IActionResult> GetChannelMessages([FromRoute] Guid channelId)
        {

            var channel = await _dbContext
                .Channels
                .Include(c => c.ChannelMessages)
                .ThenInclude(cm => cm.ChannelFile)
                .FirstOrDefaultAsync(c => c.Id == channelId);

            if(channel == null)
            {
                return NotFound();
            }

            var mappedChannelMessages = channel
                .ChannelMessages
                .Select(ChannelMessagesMapper.ChannelMessageToChannelMessageDto);


            return Ok(mappedChannelMessages.OrderBy(m => m.SentAt));
        }

        [HttpPost("add-channel-message")]
        public async Task<IActionResult> AddChannelMessage(
            [FromForm] string? content,
            [FromForm] string senderId,
            [FromForm] Guid channelId,
            [FromForm] IFormFile? file,
            [FromForm] string? fileType,
            [FromForm] string? fileName
        )
        {
            var fileUrl = "";

            var channel = await _dbContext
                .Channels
                .Include(c => c.ChannelMessages)
                .Include(c => c.ChannelUsers)
                .FirstOrDefaultAsync(c => c.Id == channelId);

            if(channel == null)
            {
                return BadRequest("InvalidChannelId");
            }

            var newMessage = new Models.ChannelMessage
            {
                SenderId = senderId,
                ChannelId = channelId,
                SentAt = DateTime.UtcNow,
            };

            if (content != null)
            {
                newMessage.Content = content;
            }

            if(file != null)
            {
                var fileStream = file.OpenReadStream();

                fileUrl =  await _s3MessagesService.UploadFileAsync(fileStream, $"{channelId}-{senderId}-{DateTime.UtcNow}");

                newMessage.ChannelFile = new Models.ChannelFile
                {
                    FileUrl = fileUrl,
                    FileName = fileName ?? "",
                    FileType = fileType ?? "",
                };
            }

            channel.ChannelMessages.Add(newMessage);

            await _dbContext.SaveChangesAsync();

            foreach(var user in channel.ChannelUsers)
            {
                var message = new DTOs.ChannelMessageDto
                {
                    Id = Guid.Empty,
                    ChannelId = newMessage.ChannelId,
                    SenderId = newMessage.SenderId,
                    SentAt = newMessage.SentAt
                };

                if (file != null && newMessage.ChannelFile != null)
                {
                    message.File = new DTOs.Channel.ChannelFileDto
                    {
                        FileUrl = newMessage.ChannelFile.FileUrl,
                        FileName = newMessage.ChannelFile.FileName,
                        FileType = newMessage.ChannelFile.FileType,
                    };
                }

                if(content != null)
                {
                    message.Content = newMessage.Content;
                }

                await _channelMessageHub.SendMessageToChannelUserAsync(user.UserId, message);
            }
            return Ok();
        }

        [HttpPost("delete-channel-message")]
        public async Task<IActionResult> DeleteChannelMessage([FromBody] ChannelMessageDeleteRequest data)
        {
            var channel = await _dbContext
                .Channels
                .Include(c => c.ChannelMessages)
                .FirstOrDefaultAsync(c => c.Id == data.ChannelId);

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

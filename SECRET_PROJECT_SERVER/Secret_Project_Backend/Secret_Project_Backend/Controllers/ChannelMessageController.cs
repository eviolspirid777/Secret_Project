using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Secret_Project_Backend.Context;
using Secret_Project_Backend.Controllers.Requests.ChannelMessages;
using Secret_Project_Backend.Controllers.Requests.Channels;
using Secret_Project_Backend.Controllers.Requests.Messages;
using Secret_Project_Backend.DTOs.Reactions;
using Secret_Project_Backend.Mappers.Messages;
using Secret_Project_Backend.Models;
using Secret_Project_Backend.Services.ChannelChat;
using Secret_Project_Backend.Services.Chat;
using Secret_Project_Backend.Services.S3;

namespace Secret_Project_Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ChannelMessageController : ControllerBase
    {
        private readonly PostgreSQLDbContext _dbContext;
        private readonly S3ServiceMessages _s3MessagesService;
        private readonly ChannelChatSignlaRService _channelMessageHub;
        private readonly ChannelChatSignlaRService _chatMessageService;

        public ChannelMessageController(
            PostgreSQLDbContext dbContext,
            S3ServiceMessages s3MessagesService,
            ChannelChatSignlaRService channelMessageHub,
            ChannelChatSignlaRService chatMessageService
        )
        {
            _dbContext = dbContext;
            _s3MessagesService = s3MessagesService;
            _channelMessageHub = channelMessageHub;
            _chatMessageService = chatMessageService;
        }

        [HttpGet("get-channel-messages/{channelId}")]
        public async Task<IActionResult> GetChannelMessages([FromRoute] Guid channelId)
        {

            var channel = await _dbContext
                .Channels
                .AsNoTracking()
                .Include(c => c.ChannelMessages)
                .ThenInclude(cm => cm.ChannelFile)
                .Include(c => c.ChannelMessages)
                .ThenInclude(cm => cm.Reactions)
                .Include(c => c.ChannelMessages)
                .ThenInclude(cm => cm.RepliedChannelMessage)
                .ThenInclude(cm => cm.Sender)
                .Include(c => c.ChannelMessages)
                .ThenInclude(cm => cm.RepliedChannelMessage)
                .ThenInclude(rcm => rcm.ChannelFile)
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
            [FromForm] AddChannelMessageRequest data
        )
        {
            var fileUrl = "";

            var channel = await _dbContext
                .Channels
                .Include(c => c.ChannelMessages)
                .Include(c => c.ChannelUsers)
                .FirstOrDefaultAsync(c => c.Id == data.ChannelId);

            if(channel == null)
            {
                return BadRequest("InvalidChannelId");
            }

            var newMessage = new Models.ChannelMessage
            {
                SenderId = data.SenderId,
                ChannelId = data.ChannelId,
                SentAt = DateTime.UtcNow,
            };

            if(data.RepliedMessageId != null)
            {
                newMessage.RepliedId = data.RepliedMessageId;
            }

            if (data.Content != null)
            {
                newMessage.Content = data.Content;
            }

            if(data.File != null)
            {
                var fileStream = data.File.OpenReadStream();

                fileUrl =  await _s3MessagesService.UploadFileAsync(fileStream, $"{data.ChannelId}-{data.SenderId}-{DateTime.UtcNow}");

                newMessage.ChannelFile = new Models.ChannelFile
                {
                    FileUrl = fileUrl,
                    FileName = data.FileName ?? "",
                    FileType = data.FileType ?? "",
                };
            }

            var channelMessageFromStore = await _dbContext.ChannelMessages.AddAsync(newMessage);
            await _dbContext.SaveChangesAsync();

            foreach(var user in channel.ChannelUsers)
            {
                var message = new DTOs.ChannelMessageDto
                {
                    Id = channelMessageFromStore.Entity.Id,
                    ChannelId = newMessage.ChannelId,
                    SenderId = newMessage.SenderId,
                    SentAt = newMessage.SentAt
                };

                if (data.File != null && newMessage.ChannelFile != null)
                {
                    message.File = new DTOs.Channel.ChannelFileDto
                    {
                        FileUrl = newMessage.ChannelFile.FileUrl,
                        FileName = newMessage.ChannelFile.FileName,
                        FileType = newMessage.ChannelFile.FileType,
                    };
                }

                if(data.Content != null)
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

        [HttpPost("add-message-reaction")]
        public async Task<IActionResult> AddMessageReaction([FromBody] AddChannelMessageReactionRequest data)
        {
            var reaction = new Reaction
            {
                Emotion = data.Emotion,
                ChannelMessageId = data.ChannelMessageId,
                UserId = data.UserId
            };

            var reactionFromStore = await _dbContext
                    .Reactions
                    .FirstOrDefaultAsync(r => r.ChannelMessageId == data.ChannelMessageId && r.UserId == data.UserId);

            if (reactionFromStore != null)
            {
                _dbContext.Reactions.Remove(reactionFromStore);
            }

            var reactionEntity = await _dbContext.Reactions.AddAsync(reaction);

            await _dbContext.SaveChangesAsync();

            var message = await _dbContext
                    .ChannelMessages
                    .Include(cm => cm.Channel)
                    .ThenInclude(c => c.ChannelUsers)
                    .FirstOrDefaultAsync(channelMessage => channelMessage.Id == data.ChannelMessageId);
            
            if (message != null)
            {
                ReactionDto reactionDto = new()
                {
                    Id = reactionEntity.Entity.Id.ToString(),
                    Emotion = data.Emotion,
                    MessageId = data.ChannelMessageId,
                    UserId = data.UserId
                };

                var userIds = message.Channel.ChannelUsers.Select(cu => cu.UserId).ToArray();
                await _channelMessageHub.NotifyChannelUsersAboutReaction(userIds, reactionDto);
            }

            return Ok();
        }
    }
}

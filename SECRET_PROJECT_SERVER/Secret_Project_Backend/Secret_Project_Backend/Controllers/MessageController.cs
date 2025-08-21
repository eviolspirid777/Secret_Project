using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Secret_Project_Backend.Context;
using Secret_Project_Backend.Controllers.Requests.Messages;
using Secret_Project_Backend.Controllers.Requests.User.Room;
using Secret_Project_Backend.DTOs.Reactions;
using Secret_Project_Backend.DTOs.User;
using Secret_Project_Backend.Mappers.Messages;
using Secret_Project_Backend.Mappers.User;
using Secret_Project_Backend.Mappers.UserRoom;
using Secret_Project_Backend.Models;
using Secret_Project_Backend.Services.Chat;
using Secret_Project_Backend.Services.S3;
using Secret_Project_Backend.Utils.FriendsParserFunc;
using System.IO.Compression;
using System.Text.Json;

namespace Secret_Project_Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MessageController : ControllerBase
    {
        private readonly PostgreSQLDbContext _dbContext;
        private readonly MessageService _messageService;
        private readonly S3ServiceMessages _s3Service;

        public MessageController(
            PostgreSQLDbContext dbContext,
            MessageService messageService,
            S3ServiceMessages s3Service
        )
        {
            _dbContext = dbContext;
            _messageService = messageService;
            _s3Service = s3Service;
        }

        [HttpPost("get-messages")]
        public async Task<IActionResult> GetMessages([FromBody] GetMessagesRequest data)
        {
            int skip;
            if(data.Page == 0)
            {
                skip = 0;
            }
            else
            {
                skip = data.Page * 20;
            }

            var messagesQuerable = _dbContext
                .Messages
                .Include(m => m.File)
                .Include(m => m.Reactions)
                .Include(m => m.RepliedMessage)
                .ThenInclude(rm => rm.File)
                .Include(m => m.RepliedMessage)
                .ThenInclude(rm => rm.Sender)
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
                    .OrderByDescending(m => m.SentAt)
                    .Skip(skip)
                    .Take(20)
                    .ToListAsync();

            var mappedMessages = messages.Select(MessageMapper.MapMessageToMessageDto);

            //var serialized = JsonSerializer.Serialize(mappedMessages);
            //var bytes = System.Text.Encoding.UTF8.GetBytes(serialized);

            //using var ms = new MemoryStream();
            //using (var brotli = new BrotliStream(ms, CompressionLevel.Fastest, true))
            //{
            //    brotli.Write(bytes, 0, bytes.Length);
            //}
            //var compressed = ms.ToArray();

            //Response.Headers.Add("Content-Encoding", "br");
            //return File(compressed, "application/json");
            return Ok(mappedMessages);
        }

        [HttpPost("add-message")]
        public async Task<IActionResult> AddMessage(
            [FromForm] AddMessageRequest data
        )
        {
            if(data.SenderId == null || data.ReciverId == null)
            {
                return BadRequest("Данные неправильные!");
            }

            if(string.IsNullOrEmpty(data.Content) && data.File == null)
            {
                return BadRequest("Пустые данные!");
            }

            var message = new Message()
            {
                ReciverId = data.ReciverId,
                SenderId = data.SenderId,
                Content = data.Content,
                SentAt = DateTime.UtcNow,
                RepliedId = data.RepliedMessageId
            };

            if (data.File != null)
            {
                using var stream = data.File.OpenReadStream();

                var fileString = await _s3Service.UploadFileAsync(stream, Guid.NewGuid().ToString());

                message.File = new Models.File()
                {
                    FileName = data.FileName ?? "",
                    FileType = data.FileType ?? "",
                    FileUrl = fileString,
                };
            }

            await _dbContext.Messages.AddAsync(message);
            await _dbContext.SaveChangesAsync();

            var messageDb = await _dbContext.Messages
                                    .Include(m => m.File)
                                    .Include(m => m.RepliedMessage)
                                    .ThenInclude(rm => rm.File)
                                    .Include(m => m.RepliedMessage)
                                    .ThenInclude(rm => rm.Sender)
                                    .AsNoTracking()
                                    .FirstOrDefaultAsync(m => m.Id == message.Id);

            var messageDto = MessageMapper.MapMessageToMessageDto(messageDb ?? message);

            await _messageService.NotifyUserAsync(data.SenderId, messageDto);
            await _messageService.NotifyUserAsync(data.ReciverId, messageDto);

            return Ok(messageDto);
        }

        [HttpPost("delete")]
        public async Task<IActionResult> DeleteMessage([FromBody] DeleteMessageRequest data)
        {
            var message = await _dbContext
                .Messages
                .Include(m => m.File)
                .FirstOrDefaultAsync(m => m.Id == data.MessageId);

            if(message == null)
            {
                return BadRequest("Invalid message id");
            }

            if(message.File != null)
            {
                await _s3Service.DeleteFileAsync(message.File.FileName);
            }

            _dbContext.Messages.Remove(message);
            await _dbContext.SaveChangesAsync();

            await _messageService.NotifyUserAboutMessageDeleteAsync(message.SenderId, message);
            //TODO: Этот механизм все равно удаляет с бд данные, поэтому нужно еще посмотреть что придумать
            //if(data.ForAllUsers)
            //{
                await _messageService.NotifyUserAboutMessageDeleteAsync(message.ReciverId, message);
            //}

            return Ok();
        }

        #region Reaction
        [HttpPost("add-message-reaction")]
        public async Task<IActionResult> AddMessageReaction([FromBody] AddMessageReactionRequest data)
        {
            var reaction = new Reaction
            {
                Emotion = data.Emotion,
                MessageId = data.MessageId,
                UserId = data.UserId
            };

            var reactionFromStore = await _dbContext
                    .Reactions
                    .FirstOrDefaultAsync(r => r.MessageId == data.MessageId && r.UserId == data.UserId);

            if(reactionFromStore != null)
            {
                _dbContext.Reactions.Remove(reactionFromStore);
            }

            var reactionEntity = await _dbContext.Reactions.AddAsync(reaction);

            await _dbContext.SaveChangesAsync();

            var message = await _dbContext.Messages.FirstOrDefaultAsync(message => message.Id == data.MessageId);
            if (message != null)
            {
                ReactionDto reactionDto = new()
                {
                    Id = reactionEntity.Entity.Id.ToString(),
                    Emotion = data.Emotion,
                    MessageId = data.MessageId,
                    UserId = data.UserId
                };

                await _messageService.NotifyUserAboutReactionAsync(message.ReciverId, reactionDto);
                await _messageService.NotifyUserAboutReactionAsync(message.SenderId, reactionDto);
            }

            return Ok();
        }

        [HttpDelete("remove-message-reaction/{ReactionId}")]
        public async Task<IActionResult> RemoveMessageReaction([FromRoute] Guid ReactionId)
        {

            var reaction = await _dbContext.Reactions.FirstOrDefaultAsync(r => r.Id == ReactionId);

            if(reaction == null)
            {
                return BadRequest();
            }

            _dbContext.Remove(reaction);

            await _dbContext.SaveChangesAsync();
            return Ok();
        }
        #endregion Reaction

        #region Room
        [HttpGet("user/room")] 
        public async Task<IActionResult> GetRoomInformation([FromQuery] string LeftUserId, [FromQuery] string RightUserId)
        {
            var userRoom = await _dbContext
                .UserRooms
                .AsNoTracking()
                .Include(ur => ur.LeftUser)
                .Include(ur => ur.RightUser)
                .FirstOrDefaultAsync(ur => (ur.LeftUser.Id == LeftUserId && ur.RightUser.Id == RightUserId) ||
                                                            (ur.RightUser.Id == LeftUserId && ur.LeftUser.Id == RightUserId));

            if(userRoom == null)
            {
                return NoContent();
            }

            var mappedRoom = UserRoomMapper.MapUserRoomToUserRoomDto(userRoom);

            return Ok(mappedRoom);
        }

        [HttpGet("user/room/{roomId}/users")]
        public async Task<IActionResult> GetRoomUsers([FromRoute] Guid roomId)
        {
            var userRoom = await _dbContext
                .UserRooms
                .AsNoTracking()
                .Include(ur => ur.LeftUser)
                .Include(ur => ur.RightUser)
                .FirstOrDefaultAsync(r => r.Id == roomId);

            if(userRoom == null)
            {
                return NotFound();
            }

            var leftUser = UserMapper.MapUserToUserDto(userRoom.LeftUser, userRoom.LeftUserId);
            var rightUser = UserMapper.MapUserToUserDto(userRoom.RightUser, userRoom.RightUserId);

            return Ok(new List<UserDTO>() { leftUser, rightUser});
        }

        [HttpPost("user/room/create")]
        public async Task<IActionResult> CreateRoom([FromBody] UserRoomCreateRequest data)
        {

            var isRoomExist = await _dbContext
                .UserRooms
                .Include(ur => ur.LeftUser)
                .Include(ur => ur.RightUser)
                .AnyAsync(ur => (ur.LeftUser.Id == data.FromUserId && ur.RightUser.Id == data.ToUserId) ||
                                            (ur.LeftUser.Id == data.ToUserId && ur.RightUser.Id == data.FromUserId));

            if(isRoomExist)
            {
                return BadRequest("Room already exist!");
            }

            var callReciver = await _dbContext.Users.FirstOrDefaultAsync(u => u.Id == data.FromUserId);

            if (callReciver == null) return BadRequest("Invalid UserId");


            var addEntityEntry = await _dbContext.UserRooms.AddAsync(new Models.UserRoom
            {
                LeftUserId = data.FromUserId,
                RightUserId = data.ToUserId
            });

            await _dbContext.SaveChangesAsync();


            await _messageService.SendRoomWasCreatedToUserAsync(data.FromUserId, new DTOs.UserRoom.UserRoomDto
            {
                Id = addEntityEntry.Entity.Id,
                LeftUserId = data.FromUserId,
                RightUserId = data.ToUserId,
                MutedAudioUserIds = [],
                MutedVideoUserIds = []
            });

            await _messageService.SendRoomWasCreatedToUserAsync(data.ToUserId, new DTOs.UserRoom.UserRoomDto
            {
                Id = addEntityEntry.Entity.Id,
                LeftUserId = data.FromUserId,
                RightUserId = data.ToUserId,
                MutedAudioUserIds = [],
                MutedVideoUserIds = []
            });

            await _messageService.SendCallingRequestToUserAsync(data.ToUserId, new DTOs.User.UserShortDto
            {
                Id = callReciver.Id,
                Avatar = callReciver.AvatarUrl ?? "",
                Name = callReciver.DisplayName,
                Status = callReciver.Status.ToString()
            });

            return Ok(addEntityEntry.Entity.Id);
        }

        [HttpPost("user/room/join")]
        public async Task<IActionResult> JoinRoom([FromBody] UserRoomJoinRequest data)
        {

            var userRoom = await _dbContext
                .UserRooms
                .FirstOrDefaultAsync(ur => ur.Id == data.RoomId);

            if(userRoom == null)
            {
                return BadRequest("Invalid roomId");
            }

            userRoom.RightUserId = data.UserId;

            await _dbContext.SaveChangesAsync();
            return Ok(userRoom);
        }

        [HttpPost("user/room/delete-room")]
        public async Task<IActionResult> DeleteRoom([FromBody] UserRoomDeleteRequest data)
        {
            var userRoom = await _dbContext
                .UserRooms
                .Include(ur => ur.RightUser)
                .Include(ur => ur.LeftUser)
                .FirstOrDefaultAsync(ur => ur.Id == data.RoomId);
            
            if(userRoom == null)
            {
                return BadRequest("Room was not found!");
            }

            var leftUser = userRoom.LeftUser;
            var rightUser = userRoom.RightUser;


            _dbContext.UserRooms.Remove(userRoom);

            await _dbContext.SaveChangesAsync();

            if (leftUser == null || rightUser == null) return BadRequest("Users are not exist!");

            await _messageService.SendRoomWasDeletedToUserAsync(leftUser.Id ?? "", data.RoomId);
            await _messageService.SendRoomWasDeletedToUserAsync(rightUser.Id ?? "", data.RoomId);

            await _messageService.AbortCallingRequestToUserAsync(rightUser.Id, new DTOs.User.UserShortDto
            {
                Id = rightUser.Id,
                Avatar = rightUser.AvatarUrl,
                Name = rightUser.DisplayName,
                Status = rightUser.Status.ToString()
            });

            return Ok();
        }
        #endregion Room
    }
}

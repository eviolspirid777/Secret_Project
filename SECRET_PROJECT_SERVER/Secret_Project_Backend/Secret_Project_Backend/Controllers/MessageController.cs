using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Secret_Project_Backend.Context;
using Secret_Project_Backend.Controllers.Requests.Messages;
using Secret_Project_Backend.DTOs.Messages;
using Secret_Project_Backend.Mappers.Messages;
using Secret_Project_Backend.Mappers.Room;
using Secret_Project_Backend.Services.Chat;
using Secret_Project_Backend.Services.S3;
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
            var messagesQuerable = _dbContext
                .Messages
                .Include(m => m.File)
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
        public async Task<IActionResult> AddMessage(
            [FromForm] string SenderId,
            [FromForm] string ReciverId,
            [FromForm] string? Content,
            [FromForm] IFormFile? File,
            [FromForm] string? FileType,
            [FromForm] string? FileName
        )
        {
            if(SenderId == null || ReciverId == null)
            {
                return BadRequest("Данные неправильные!");
            }

            if(string.IsNullOrEmpty(Content) && File == null)
            {
                return BadRequest("Пустые данные!");
            }

            var message = new Models.Message()
            {
                ReciverId = ReciverId,
                SenderId = SenderId,
                Content = Content,
                SentAt = DateTime.UtcNow,
            };

            if (File != null)
            {
                using var stream = File.OpenReadStream();

                var fileString = await _s3Service.UploadFileAsync(stream, Guid.NewGuid().ToString());

                message.File = new Models.File()
                {
                    FileName = FileName ?? "",
                    FileType = FileType ?? "",
                    FileUrl = fileString,
                };
            }

            await _dbContext.Messages.AddAsync(message);
            await _dbContext.SaveChangesAsync();

            var messageDto = MessageMapper.MapMessageToMessageDto(message);

            await _messageService.NotifyUserAsync(SenderId, messageDto);
            await _messageService.NotifyUserAsync(ReciverId, messageDto);

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

        #region Room
        [HttpGet("user/{userId}/room")] 
        public async Task<IActionResult> GetRoomInformation([FromRoute] string userId)
        {
            var user = await _dbContext.Users.Include(u => u.Room).FirstOrDefaultAsync(u => u.Id == userId);

            if(user == null)
            {
                return BadRequest("Invalid user data");
            }

            if(user.Room == null)
            {
                return BadRequest("Invalid room data");
            }

            var mappedRoom = RoomMapper.MapRoomToRoomDto(user.Room);

            return Ok(mappedRoom);
        }

        [HttpPost("user/{userId}/room/create-room")]
        public async Task<IActionResult> CreateRoom([FromRoute] string userId)
        {
            var user = await _dbContext
                .Users
                .Include(u => u.Room)
                .FirstOrDefaultAsync(u => u.Id == userId);
            
            if(user == null)
            {
                return BadRequest("Invalid userId");
            }

            if(user.Room != null)
            {
                return BadRequest("Room is already exist");
            }

            var roomId = Guid.NewGuid();

            user.Room = new Models.Room
            {
                UserId = userId,
                Id = roomId,
            };

            await _dbContext.SaveChangesAsync();

            await _messageService.SendRoomWasCreatedToUserAsync(userId, new DTOs.Room.RoomDto
            {
                Id = roomId,
            });
            
            return Ok(roomId);
        }

        [HttpPost("user/{userId}/room/delete-room/{roomId}")]
        public async Task<IActionResult> DeleteRoom([FromRoute] string userId, [FromRoute] string roomId)
        {
            var user = await _dbContext
                .Users
                .Include(u => u.Room)
                .FirstOrDefaultAsync(u => u.Id == userId);


            if (user == null)
            {
                return BadRequest("Invalid userId");
            }

            if (user.Room == null)
            {
                return NotFound("Room is not exist");
            }

            var roomIdFromBase = user.Room.Id;


            _dbContext.Rooms.Remove(user.Room);

            await _dbContext.SaveChangesAsync();

            await _messageService.SendRoomWasDeletedToUserAsync(userId, roomIdFromBase);
            return Ok();
        }
        #endregion Room
    }
}

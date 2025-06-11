using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Secret_Project_Backend.Context;
using Secret_Project_Backend.Controllers.Requests.Messages;
using Secret_Project_Backend.Controllers.Requests.User.Room;
using Secret_Project_Backend.Mappers.Messages;
using Secret_Project_Backend.Mappers.UserRoom;
using Secret_Project_Backend.Services.Chat;
using Secret_Project_Backend.Services.S3;
using Secret_Project_Backend.Utils.FriendsParserFunc;

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
                return BadRequest("Invalid user data");
            }

            var mappedRoom = UserRoomMapper.MapUserRoomToUserRoomDto(userRoom);

            return Ok(mappedRoom);
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

            var addEntityEntry = await _dbContext.UserRooms.AddAsync(new Models.UserRoom
            {
                LeftUserId = data.FromUserId,
                RightUserId = data.ToUserId
            });

            await _dbContext.SaveChangesAsync();

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
            var userRoom = await _dbContext.UserRooms.FirstOrDefaultAsync(ur => ur.Id == data.RoomId);
            
            if(userRoom == null)
            {
                return BadRequest("Room was not found!");
            }

            _dbContext.UserRooms.Remove(userRoom);

            await _dbContext.SaveChangesAsync();

            return Ok();
        }
        #endregion Room
    }
}

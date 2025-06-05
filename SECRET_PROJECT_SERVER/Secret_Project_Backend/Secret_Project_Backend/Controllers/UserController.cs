using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Secret_Project_Backend.Context;
using Secret_Project_Backend.Controllers.Requests.User;
using Secret_Project_Backend.DTOs;
using Secret_Project_Backend.Mappers.FriendShip;
using Secret_Project_Backend.Mappers.User;
using Secret_Project_Backend.Models;
using Secret_Project_Backend.Services.Status;
using Secret_Project_Backend.Services.User;
using Secret_Project_Backend.SignalR;
using System.Text.Json;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace Secret_Project_Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly PostgreSQLDbContext _dbContext;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly ChangeUserStatusService _userStatusService;
        private readonly IHubContext<FriendRequestHub> _hubFriendContext;
        private readonly IHubContext<StatusHub> _hubUserStatusContext;
        private readonly UserService _userService;

        public UserController(
            PostgreSQLDbContext dbContext,
            UserManager<ApplicationUser> userManager,
            ChangeUserStatusService userStatusService,
            IHubContext<FriendRequestHub> hubFriendContext,
            IHubContext<StatusHub> hubUserStatusContext,
            UserService userService
        )
        {
            _dbContext = dbContext;
            _userManager = userManager;
            _userStatusService = userStatusService;
            _hubFriendContext = hubFriendContext;
            _hubUserStatusContext = hubUserStatusContext;
            _userService = userService;
        }

        #region User
        [Authorize]
        [HttpPost("change-user-status")]
        public async Task<IActionResult> ChangeStatusUser([FromBody] ChangeUserStatusRequest data)
        {
            try
            {
                var user = await _dbContext.Users.FirstOrDefaultAsync(u => u.Id == data.UserId);
                if (user == null)
                {
                    return BadRequest("Пользователь с таким Id не найден");
                }
                var parsedValue = Enum.Parse<ConnectionState>(data.Status);
                user.Status = parsedValue;
                await _dbContext.SaveChangesAsync();

                var friends = await _userService.GetUserFriendsAsync(data.UserId);
                foreach (var friend in friends)
                {
                    await _hubUserStatusContext.Clients.User(friend.UserId).SendAsync("friendStatusChange", data.UserId, data.Status);
                }
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest("Неправильный статус");
            }
        }

        [Authorize]
        [HttpGet("user-short-information")]
        public async Task<IActionResult> GetUserShortInformation([FromQuery] string email)
        {
            var user = await _dbContext
                                            .Users
                                            .AsNoTracking()
                                            .FirstOrDefaultAsync(u => u.Email == email);
            if(user == null)
            {
                return BadRequest();
            }

            var result = UserMapper.MapUserToUserShortDto(user);
            return Ok(result);
        }

        [Authorize]
        [HttpGet("user-information/{id}")]
        public async Task<IActionResult> GetUserInformation(string id)
        {
            var user = await _dbContext.Users.FirstOrDefaultAsync(user => user.Id == id);
            if(user == null)
            {
                return BadRequest("User was not found");
            }
            var mappedUser = UserMapper.MapUserToUserDto(user, id);
            return Ok(mappedUser);
        }

        [Authorize]
        [HttpPost("change-user-information")]
        public async Task<IActionResult> ChangeUserInformation([FromBody] UserInformationRequest data)
        {
            var user = await _dbContext.Users.FirstOrDefaultAsync(u => u.Id == data.UserId);
            if(user == null)
            {
                return BadRequest("Invalid UserId");
            }

            if(data.Avatar != null)
            {
                //TODO: здесь нужно будет добавить логику для добавления изображения
                user.AvatarUrl = "";
            }
            if(data.Name != null)
            {
                user.DisplayName = data.Name;
            }

            await _dbContext.SaveChangesAsync();
            return Ok();
        }
        #endregion User
        #region Friendship
        [Authorize]
        [HttpGet("friend/get-friend-requests")]
        public async Task<IActionResult> GetFriendRequestCount([FromQuery] string id)
        {
            if(id == null)
            {
                return BadRequest();
            }

            var _friendships = await _dbContext
                            .Friendships
                            .AsNoTracking()
                            .Include(f => f.Friend)
                            .Include(f => f.User)
                            .Where(f => f.FriendId == id && f.Status == FriendshipStatus.Pending)
                            .ToListAsync();

            var friends= _friendships.Select(FriendShipMapper.MapFriendshipToFriendshipDto).Select(f => f.User);
            return Ok(friends);
        }

        [Authorize]
        [HttpGet("friend/get-user-friends/{id}")]
        public async Task<IActionResult> GetUserFriends(string id)
        {
            try
            {
                var friends = await _userService.GetUserFriendsAsync(id);
                return Ok(friends);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [Authorize]
        [HttpPost("friend/send-request")]
        public async Task<IActionResult> SendFriendRequest([FromBody] FriendRequest data)
        {
            if(!Guid.TryParse(data.ToUserId, out Guid result))
            {
                return BadRequest("Такого пользователя не существует");
            }

            var alreadyExist = _dbContext
                                            .Friendships
                                            .Any(fs => 
                                                        (fs.FriendId == data.FromUserId && fs.UserId == data.ToUserId) ||
                                                        (fs.FriendId == data.ToUserId && fs.UserId == data.FromUserId));
            if (alreadyExist)
            {
                //TODO: подумай какую ошибку возвращать. Впрниципе срабатывает нормально
                return BadRequest();
            }

            await _dbContext.Friendships.AddAsync(new Friendship()
            {
                Id = Guid.NewGuid().ToString(),
                UserId = data.FromUserId,
                FriendId = data.ToUserId,
                Status = FriendshipStatus.Pending
            });

            await _dbContext.SaveChangesAsync();

            await _hubFriendContext.Clients.User(data.ToUserId).SendAsync("ReceiveFriendRequest", data.FromUserId);
            return Ok();
        }

        //TODO: Логика ниже похожа и можно вынести в отдельный сервис в зависимости от того, какой статус ты передашь
        [Authorize]
        [HttpPost("friend/accept-request")]
        public async Task<IActionResult> AcceptRequest([FromBody] FriendRequest data)
        {
            var result = await _dbContext.Friendships.FirstOrDefaultAsync(fs => (fs.FriendId == data.FromUserId && fs.UserId == data.ToUserId) || (fs.FriendId == data.ToUserId && fs.UserId == data.FromUserId));
            if(result == null)
            {
                return BadRequest();
            }

            result.Status = FriendshipStatus.Accepted;
            await _dbContext.SaveChangesAsync();

            return Ok();
        }

        [Authorize]
        [HttpPost("friend/decline-request")]
        public async Task<IActionResult> DeclineRequest([FromBody] FriendRequest data)
        {
            var result = await _dbContext.Friendships.FirstOrDefaultAsync(fs => (fs.FriendId == data.FromUserId && fs.UserId == data.ToUserId) || (fs.FriendId == data.ToUserId && fs.UserId == data.FromUserId));
            if (result == null)
            {
                return BadRequest();
            }

            result.Status = FriendshipStatus.Blocked;
            await _dbContext.SaveChangesAsync();

            return Ok();
        }

        [Authorize]
        [HttpPost]
        public async Task<IActionResult> DeleteFriend([FromBody] FriendRequest data)
        {
            var friendship = await _dbContext.Friendships.FirstOrDefaultAsync(f => (f.User.Id == data.FromUserId && f.Friend.Id == data.ToUserId) || (f.User.Id == data.ToUserId && f.Friend.Id == data.FromUserId));
            if(friendship == null)
            {
                return BadRequest("Invalid userId");
            }
            _dbContext.Friendships.Remove(friendship);

            await _dbContext.SaveChangesAsync();
            return Ok();
        }
        #endregion Friendship
        #region Status
        [Authorize]
        [HttpPost("status/change-status/{id}")]
        public async Task<IActionResult> ChangeUserStatus(string id, [FromBody] Models.ConnectionState state)
        {
            var result = await _userStatusService.ChangeStatusAsync(state,id);
            if(result == false)
            {
                return BadRequest();
            }
            return Ok();
        }
        #endregion Status
        #region SoundConnectionState
        [Authorize]
        [HttpPost("sound-states/change-microphone-state/{id}")]
        public async Task<IActionResult> ChangeMicrophoneState(string id)
        {
            var user = await _dbContext.Users.FirstOrDefaultAsync(u => u.Id == id);
            if(user == null)
            {
                return BadRequest("Invalid user id");
            }
            user.IsMicrophoneMuted = !user.IsMicrophoneMuted;

            await _dbContext.SaveChangesAsync();
            return Ok(user.IsMicrophoneMuted);
        }

        [Authorize]
        [HttpPost("sound-states/change-headphones-state/{id}")]
        public async Task<IActionResult> ChangeHeadphonesState(string id)
        {
            var user = await _dbContext.Users.FirstOrDefaultAsync(u => u.Id == id);
            if (user == null)
            {
                return BadRequest("Invalid user id");
            }
            user.IsHeadphonesMuted = !user.IsHeadphonesMuted;

            await _dbContext.SaveChangesAsync();
            return Ok(user.IsHeadphonesMuted);
        }
        #endregion SoundConnectionState
    }
}

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Secret_Project_Backend.Context;
using Secret_Project_Backend.Controllers.Requests.User;
using Secret_Project_Backend.DTOs;
using Secret_Project_Backend.Mappers.User;
using Secret_Project_Backend.Models;
using Secret_Project_Backend.Services.Status;

namespace Secret_Project_Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly PostgreSQLDbContext _dbContext;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly ChangeUserStatusService _userStatusService;
        public UserController(
            PostgreSQLDbContext dbContext,
            UserManager<ApplicationUser> userManager,
            ChangeUserStatusService userStatusService
        )
        {
            _dbContext = dbContext;
            _userManager = userManager;
            _userStatusService = userStatusService;
        }

        #region User
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
        [HttpPost("friend/send-request")]
        public async Task<IActionResult> SendFriendRequest([FromBody] FriendRequest data)
        {
            var alreadyExist = _dbContext.Friendships.Any(fs => (fs.FriendId == data.FromUserId && fs.UserId == data.ToUserId) || (fs.FriendId == data.ToUserId && fs.UserId == data.FromUserId));
            if (alreadyExist)
            {
                return BadRequest();
            }

            await _dbContext.Friendships.AddAsync(new Friendship()
            {
                UserId = data.FromUserId,
                FriendId = data.ToUserId,
                Status = FriendshipStatus.Pending
            });

            await _dbContext.SaveChangesAsync();

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
        #endregion Friendship
        #region Status
        [Authorize]
        [HttpPost("status/change-status/{id}")]
        public async Task<IActionResult> ChangeUserStatus(string id, [FromBody] Models.States state)
        {
            var result = await _userStatusService.ChangeStatusAsync(state,id);
            if(result == false)
            {
                return BadRequest();
            }
            return Ok();
        }
        #endregion Status
        #region SoundStates
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
        #endregion SoundStates
    }
}

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SecretProject.Data.Contracts.User;
using SecretProject.Service.HttpGateway.Web.DataStore.Mappers.User;
using System.Data;

namespace SecretProject.Service.HttpGateway.Web.Controllers.User
{
    public partial class UserController
    {
        #region User
        //[Authorize]
        //[HttpPost("change-user-avatar")]
        //public async Task<IActionResult> ChangeUserAvatar([FromForm] ChangeUserAvatarRequest data)
        //{
        //    var user = await _dbContext.Users.FirstOrDefaultAsync(u => u.Id == data.UserId.ToString());
        //    if (user == null)
        //    {
        //        return BadRequest("Invalid userId");
        //    }

        //    using var stream = data.File.OpenReadStream();

        //    //TODO: могут заспамить аватарками новыми
        //    //var userAvatar = await _s3ServiceAvatars.GetFileAsync(userId.ToString());
        //    //if(userAvatar != null)
        //    //{
        //    //    await _s3ServiceAvatars.DeleteFileAsync(userId.ToString());
        //    //}
        //    var userAvatarUrl = await _s3ServiceAvatars.UploadAvatarAsync(stream, data.UserId.ToString());

        //    user.AvatarUrl = userAvatarUrl;

        //    await _dbContext.SaveChangesAsync();
        //    return Ok(userAvatarUrl);
        //}

        [AllowAnonymous]
        [HttpPost("change-user-status")]
        public async Task<IActionResult> ChangeStatusUser([FromBody] ChangeUserStatusRequest request)
        {
            try
            {
                var response = _userServiceClient.ChangeUserStatus(request);
                return Ok(response);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to change user status for user {UserId}", request.UserId);
                return BadRequest("Неправильный статус");
            }
        }

        //[Authorize]
        //[HttpGet("user-short-information")]
        //public async Task<IActionResult> GetUserShortInformation([FromQuery] string email)
        //{
        //    var user = await _dbContext
        //                                    .Users
        //                                    .AsNoTracking()
        //                                    .FirstOrDefaultAsync(u => u.Email == email);
        //    if (user == null)
        //    {
        //        return BadRequest();
        //    }

        //    var result = UserMapper.MapUserToUserShortDto(user);
        //    return Ok(result);
        //}

        [AllowAnonymous]
        [HttpGet("user-information/{id}")]
        public async Task<IActionResult> GetUserInformation(string id)
        {
            try
            {
                var response = await _userServiceClient.GetUserInformationAsync(new() { Id = id });
                return Ok(response.ToDto());
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        //[Authorize]
        //[HttpPost("change-user-information")]
        //public async Task<IActionResult> ChangeUserInformation([FromBody] UserInformationRequest data)
        //{
        //    var user = await _dbContext.Users.FirstOrDefaultAsync(u => u.Id == data.UserId);
        //    if (user == null)
        //    {
        //        return BadRequest("Invalid UserId");
        //    }

        //    if (data.Avatar != null)
        //    {
        //        //TODO: здесь нужно будет добавить логику для добавления изображения
        //        user.AvatarUrl = "";
        //    }
        //    if (data.Name != null)
        //    {
        //        user.DisplayName = data.Name;
        //    }

        //    await _dbContext.SaveChangesAsync();
        //    return Ok();
        //}
        #endregion User

        #region Friendship
        [AllowAnonymous]
        [HttpGet("friend/get-friend-requests")]
        public async Task<IActionResult> GetFriendRequest([FromQuery] string id)
        {
            try
            {
                var response = await _userServiceClient.GetFriendRequestsAsync(new() { UserId = id });
                return Ok(response.Users.Select(x => x.ToDto()));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to get friend requests for user {UserId}", id);
                return BadRequest(ex.Message);
            }
        }

        //[AllowAnonymous]
        //[HttpGet("friend/get-user-friends/{id}")]
        //public async Task<IActionResult> GetUserFriends(string id)
        //{
        //    try
        //    {
        //        var friends = await _userServiceClient.GetUserFriendsAsync(id);
        //        return Ok(friends);
        //    }
        //    catch (Exception ex)
        //    {
        //        return BadRequest(ex.Message);
        //    }
        //}

        //[Authorize]
        //[HttpPost("friend/send-request")]
        //public async Task<IActionResult> SendFriendRequest([FromBody] FriendRequest data)
        //{
        //    if (!Guid.TryParse(data.ToUserId, out Guid result))
        //    {
        //        return BadRequest("Такого пользователя не существует");
        //    }

        //    var alreadyExist = _dbContext
        //                                    .Friendships
        //                                    .Any(fs =>
        //                                                (fs.FriendId == data.FromUserId && fs.UserId == data.ToUserId) ||
        //                                                (fs.FriendId == data.ToUserId && fs.UserId == data.FromUserId));
        //    if (alreadyExist)
        //    {
        //        //TODO: подумай какую ошибку возвращать. Впрниципе срабатывает нормально
        //        return BadRequest();
        //    }

        //    await _dbContext.Friendships.AddAsync(new Friendship()
        //    {
        //        Id = Guid.NewGuid().ToString(),
        //        UserId = data.FromUserId,
        //        FriendId = data.ToUserId,
        //        Status = FriendshipStatus.Pending
        //    });

        //    await _dbContext.SaveChangesAsync();

        //    await _hubFriendContext.Clients.User(data.ToUserId).SendAsync("ReceiveFriendRequest", data.FromUserId);
        //    return Ok();
        //}

        ////TODO: Логика ниже похожа и можно вынести в отдельный сервис в зависимости от того, какой статус ты передашь
        //[Authorize]
        //[HttpPost("friend/accept-request")]
        //public async Task<IActionResult> AcceptRequest([FromBody] FriendRequest data)
        //{
        //    var result = await _dbContext.Friendships.FirstOrDefaultAsync(fs => (fs.FriendId == data.FromUserId && fs.UserId == data.ToUserId) || (fs.FriendId == data.ToUserId && fs.UserId == data.FromUserId));
        //    if (result == null)
        //    {
        //        return BadRequest();
        //    }

        //    result.Status = FriendshipStatus.Accepted;
        //    await _dbContext.SaveChangesAsync();

        //    return Ok();
        //}

        //[Authorize]
        //[HttpPost("friend/decline-request")]
        //public async Task<IActionResult> DeclineRequest([FromBody] FriendRequest data)
        //{
        //    var result = await _dbContext.Friendships.FirstOrDefaultAsync(fs => (fs.FriendId == data.FromUserId && fs.UserId == data.ToUserId) || (fs.FriendId == data.ToUserId && fs.UserId == data.FromUserId));
        //    if (result == null)
        //    {
        //        return BadRequest();
        //    }

        //    result.Status = FriendshipStatus.Blocked;
        //    await _dbContext.SaveChangesAsync();

        //    return Ok();
        //}

        //[Authorize]
        //[HttpPost]
        //public async Task<IActionResult> DeleteFriend([FromBody] FriendRequest data)
        //{
        //    var friendship = await _dbContext.Friendships.FirstOrDefaultAsync(f => (f.User.Id == data.FromUserId && f.Friend.Id == data.ToUserId) || (f.User.Id == data.ToUserId && f.Friend.Id == data.FromUserId));
        //    if (friendship == null)
        //    {
        //        return BadRequest("Invalid userId");
        //    }
        //    _dbContext.Friendships.Remove(friendship);

        //    await _dbContext.SaveChangesAsync();
        //    return Ok();
        //}
        #endregion Friendship
    }
}

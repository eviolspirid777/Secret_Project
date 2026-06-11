using Grpc.Core;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SecretProject.Data.Contracts.User;
using SecretProject.Service.HttpGateway.Web.DataStore.Common;
using SecretProject.Service.HttpGateway.Web.DataStore.Mappers.Grpc;
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

        [Authorize]
        [HttpPost("change-user-status")]
        public async Task<IActionResult> ChangeStatusUser([FromBody] ChangeUserStatusRequest request, CancellationToken ct)
        {
            try
            {
                var response = await _userServiceClient.ChangeUserStatusAsync(request, cancellationToken: ct);
                return Ok(response);
            }
            catch(RpcException ex)
            {
                _logger.LogError(ex, "gRPC ошибка {UserId}", request.UserId);
                return this.ToHttpResult(ex);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Неожиданная ошибка при попытке поменять статус пользователю {UserId}", request.UserId);
                return StatusCode(500, new ErrorResponse("Internal server error"));
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

        [Authorize]
        [HttpGet("user-information/{id}")]
        public async Task<IActionResult> GetUserInformation(string id, CancellationToken ct)
        {
            try
            {
                var response = await _userServiceClient.GetUserInformationAsync(new() { Id = id }, cancellationToken: ct);
                return Ok(response.User.ToDto());
            }
            catch (RpcException ex)
            {
                _logger.LogError(ex, "gRPC ошибка {UserId}", id);
                return this.ToHttpResult(ex);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Неожиданная ошибка при попытке получить информацию о пользователе {UserId}", id);
                return StatusCode(500, new ErrorResponse("Internal server error"));
            }
        }

        [Authorize]
        [HttpPost("change-user-information")]
        public async Task<IActionResult> ChangeUserInformation([FromBody] ChangeUserInformationRequest request)
        {
            try
            {
                await _userServiceClient.ChangeUserInformationAsync(request);
                return Ok();
            }
            catch (RpcException ex)
            {
                _logger.LogError(ex, "gRPC ошибка {UserId}", request.UserId);
                return this.ToHttpResult(ex);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Неожиданная ошибка при попытке изменить информацию о пользователе {UserId}", request.UserId);
                return StatusCode(500, new ErrorResponse("Internal server error"));
            }
        }
        #endregion User

        #region Friendship
        [Authorize]
        [HttpGet("friend/get-friend-requests")]
        public async Task<IActionResult> GetFriendRequest([FromQuery] string id)
        {
            try
            {
                var response = await _userServiceClient.GetFriendRequestsAsync(new() { UserId = id });
                return Ok(response.Users.Select(x => x.ToDto()));
            }
            catch (RpcException ex)
            {
                _logger.LogError(ex, "gRPC ошибка {UserId}", id);
                return this.ToHttpResult(ex);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Неожиданная ошибка при попытке получить запросы в друзья пользователя {UserId}", id);
                return StatusCode(500, new ErrorResponse("Internal server error"));
            }
        }

        [Authorize]
        [HttpGet("friend/get-user-friends/{id}")]
        public async Task<IActionResult> GetUserFriends(string id)
        {
            try
            {
                var response = await _userServiceClient.GetFriendsAsync(new() { Id = id });
                return Ok(response.Users);
            }
            catch (RpcException ex)
            {
                _logger.LogError(ex, "gRPC ошибка {UserId}", id);
                return this.ToHttpResult(ex);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Неожиданная ошибка при попытке получить друзей пользователя {UserId}", id);
                return StatusCode(500, new ErrorResponse("Internal server error"));
            }
        }

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

        #region SoundConnectionState
        [Authorize]
        [HttpPost("sound-states/change-microphone-state/{id}")]
        public async Task<IActionResult> ChangeMicrophoneState(string id)
        {
            try
            {
                var response = await _userServiceClient.ChangeMicrophoneStateAsync(new() { Id = id});
                return Ok(response.IsMicrophoneMuted);
            }
            catch(RpcException ex)
            {
                _logger.LogError(ex, "gRPC ошибка {UserId}", id);
                return this.ToHttpResult(ex);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Неожиданная ошибка при попытке поменять режим микрофона у пользователя {UserId}", id);
                return StatusCode(500, new ErrorResponse("Internal server error"));
            }
        }

        [Authorize]
        [HttpPost("sound-states/change-headphones-state/{id}")]
        public async Task<IActionResult> ChangeHeadphonesState(string id)
        {
            try
            {
                var response = await _userServiceClient.ChangeHeadphonesStateAsync(new() { Id = id });
                return Ok(response.IsHeadphonesMuted);
            }
            catch(RpcException ex)
            {
                _logger.LogError(ex, "gRPC ошибка {UserId}", id);
                return this.ToHttpResult(ex);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Неожиданная ошибка при попытке поменять режим наушников у пользователя {UserId}", id);
                return StatusCode(500, new ErrorResponse("Internal server error"));
            }
        }
        #endregion SoundConnectionState
    }
}

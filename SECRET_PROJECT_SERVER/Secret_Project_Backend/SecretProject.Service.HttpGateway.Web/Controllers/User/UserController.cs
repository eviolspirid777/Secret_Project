using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
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

        //[Authorize]
        //[HttpPost("change-user-status")]
        //public async Task<IActionResult> ChangeStatusUser([FromBody] ChangeUserStatusRequest data)
        //{
        //    try
        //    {
        //        var user = await _dbContext.Users.FirstOrDefaultAsync(u => u.Id == data.UserId);
        //        if (user == null)
        //        {
        //            return BadRequest("Пользователь с таким Id не найден");
        //        }
        //        var parsedValue = Enum.Parse<ConnectionState>(data.Status);
        //        user.Status = parsedValue;
        //        await _dbContext.SaveChangesAsync();

        //        var friends = await _userService.GetUserFriendsAsync(data.UserId);
        //        foreach (var friend in friends)
        //        {
        //            await _hubUserStatusContext.Clients.User(friend.UserId).SendAsync("friendStatusChange", data.UserId, data.Status);
        //        }
        //        return Ok();
        //    }
        //    catch (Exception ex)
        //    {
        //        return BadRequest("Неправильный статус");
        //    }
        //}

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
        public async Task<IActionResult> GetUserInformation(string id)
        {
            var user = await _dbContext.Users.FirstOrDefaultAsync(user => user.Id == id);
            if (user == null)
            {
                return BadRequest("User was not found");
            }
            var mappedUser = UserMapper.MapUserToUserDto(user, id);
            return Ok(mappedUser);
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
    }
}

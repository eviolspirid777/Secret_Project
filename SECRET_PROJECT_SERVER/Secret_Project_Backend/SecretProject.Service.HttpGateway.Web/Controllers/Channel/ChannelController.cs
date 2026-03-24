using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SecretProject.Platform.Data.DataStore.DTOs;
using SecretProject.Platform.Data.DataStore.Models;
using SecretProject.Service.Grpc.v1.Proto;
using SecretProject.Service.HttpGateway.Web.DataStore.Channel.Requests;
using SecretProject.Service.HttpGateway.Web.DataStore.Mappers.Channel;
using SecretProject.Service.HttpGateway.Web.DataStore.Mappers.User;
using System.Security.Claims;
using Entities = SecretProject.Platform.Data.DataStore.Entities;


namespace SecretProject.Service.HttpGateway.Web.Controllers.Channel
{
    public partial class ChannelController
    {
        #region Channel
        [HttpGet("get-channel-information/{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetChannelInformation([FromRoute] Guid id)
        {
            var channel = await _dbContext
                .Channels
                .FirstOrDefaultAsync(c => c.Id == id);

            if (channel == null)
            {
                return NotFound();
            }

            var mappedChannel = ChannelMapper.ToHttp(channel);

            return Ok(mappedChannel);
        }

        [HttpPost("add-channel")]
        [AllowAnonymous]
        public async Task<IActionResult> AddChannel(AddNewChannelRequest data)
        {
            var userId = Guid.Parse(data.AdminId);

            var channel = new Entities.Channel
            {
                Id = Guid.NewGuid(),
                Name = data.Name,
                CreatedAt = DateTime.UtcNow,
                AdminId = userId,
                ChannelUsers =
                [
                    new()
                    {
                        UserId = userId,
                        Role = ChannelRole.Admin
                    }
                ]
            };

            await _dbContext.Channels.AddAsync(channel);
            await _dbContext.SaveChangesAsync();

            return Ok(channel.Id);
        }

        [HttpPost("join-channel")]
        [AllowAnonymous]
        public async Task<IActionResult> JoinChannel([FromBody] JoinChannelRequest data)
        {
            var channel = await _dbContext
                .Channels
                .Include(c => c.ChannelUsers)
                .FirstOrDefaultAsync(c => c.Id == data.ChannelId);

            if (channel == null)
            {
                return BadRequest("Invalid ChannelId");
            }

            channel.ChannelUsers.Add(new ChannelUser
            {
                UserId = Guid.Parse(data.UserId),
                ChannelId = data.ChannelId,
            });


            await _dbContext.SaveChangesAsync();
            return Ok();
        }

        [HttpDelete("delete-channel/{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> DeleteChannel([FromRoute] Guid id)
        {
            var channel = await _dbContext.Channels.FindAsync(id);
            if (channel == null)
            {
                return BadRequest("Invalid Id");
            }
            _dbContext.Channels.Remove(channel);
            await _dbContext.SaveChangesAsync();

            return Ok(channel.Id);
        }
        #endregion

        #region ChannelUser
        [HttpGet("get-user-channels/{userId}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetUserChannels(string userId)
        {
            var user = await _dbContext
                .Channels
                .AsNoTracking()
                .Include(u => u.ChannelUsers)
                .FirstOrDefaultAsync(u => u.Id == Guid.Parse(userId));

            if (user == null)
            {
                return NotFound();
            }

            var channels = await _dbContext
                                    .Channels
                                    .AsNoTracking()
                                    .Where(ch => ch.ChannelUsers.Any(chu => chu.UserId == Guid.Parse(userId)))
                                    .ToListAsync();

            var mappedChannels = channels.Select(ChannelMapper.ToHttp);

            var channelsDictionary = new Dictionary<string, ChannelDto>();

            foreach (var channel in mappedChannels)
            {
                channelsDictionary.Add(channel.Id, channel);
            }

            return Ok(channelsDictionary);
        }

        [HttpGet("channel/{id}/get-channel-users")]
        [AllowAnonymous]
        public async Task<IActionResult> GetChannelUsers(Guid id)
        {
            var channel = await _dbContext.Channels
                .Include(c => c.ChannelUsers)
                .FirstOrDefaultAsync(c => c.Id == id);

            if (channel == null)
                return NotFound();
            if(channel.ChannelUsers is null)
            {
                return Ok();
            }
            var request = new GetUsersByIdsRequest
            {
                Id = { channel.ChannelUsers.Select(cu => cu.UserId.ToString()) }
            };
            var response = await _authServiceClient.GetUsersByIdsAsync(request);
            var mappedUsers = response.Users.Select(UserMapper.ToDto);

            return Ok(mappedUsers);
        }

        [HttpPost("channel/{channelId}/add-user")]
        public async Task<IActionResult> AddUserToChannel([FromRoute] Guid channelId, [FromBody] AddNewUserToChannelRequest data)
        {
            var channelExist = await _dbContext.Channels.AnyAsync(c => c.Id == channelId);

            var response = await _authServiceClient.GetUsersByIdsAsync(new() { Id = { data.UserId.ToString() } });
            var user = response.Users.FirstOrDefault();
            if (user is null || !channelExist)
            {
                return BadRequest("Пользователя или канала с таким идентификатором не существует");
            }

            var userAlreadyJoined = await _dbContext.ChannelUsers.AnyAsync(cu => cu.UserId == data.UserId && cu.ChannelId == channelId);
            if (userAlreadyJoined)
            {
                return BadRequest("Пользователь уже состоит в данном канале");
            }

            await _dbContext.ChannelUsers.AddAsync(new ChannelUser
            {
                ChannelId = channelId,
                UserId = data.UserId,
            });

            await _dbContext.SaveChangesAsync();
            return Ok();
        }

        [HttpDelete("channel/{channelId}/delete-user/{userId}")]
        public async Task<IActionResult> DeleteUserFromChannel([FromRoute] Guid channelId, [FromRoute] string userId)
        {
            var channelUser = await _dbContext
                .ChannelUsers
                .FirstOrDefaultAsync(cu => cu.ChannelId == channelId && cu.UserId == Guid.Parse(userId));

            if (channelUser == null)
            {
                return NotFound();
            }

            _dbContext.ChannelUsers.Remove(channelUser);

            await _dbContext.SaveChangesAsync();
            return Ok();
        }
        #endregion ChannelUser
    }
}

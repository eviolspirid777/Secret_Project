using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SecretProject.Service.Grpc.v1.Proto;
using SecretProject.Service.HttpGateway.Web.DataStore.Channel.Requests;
using SecretProject.Service.HttpGateway.Web.DataStore.Mappers.Channel;
using SecretProject.Service.HttpGateway.Web.DataStore.Mappers.User;

namespace SecretProject.Service.HttpGateway.Web.Controllers.Channel
{
    public partial class ChannelController
    {
        [HttpGet("get-channel-information/{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetChannelInformation([FromRoute] Guid id, CancellationToken ct)
        {
            var response = await _channelServiceClient.GetChannelInformationAsync(
                new GetChannelInformationRequest { ChannelId = id.ToString() },
                cancellationToken: ct);

            if (!response.Success)
                return NotFound(response.ErrorMessage);

            return Ok(ChannelMapper.ToHttp(response.Channel));
        }

        [HttpPost("add-channel")]
        [AllowAnonymous]
        public async Task<IActionResult> AddChannel([FromBody] AddNewChannelRequest data, CancellationToken ct)
        {
            var response = await _channelServiceClient.CreateChannelAsync(
                new CreateChannelRequest
                {
                    Name = data.Name,
                    ChannelAvatarUrl = data.ChannelAvatarUrl ?? string.Empty,
                    AdminUserId = data.AdminId
                },
                cancellationToken: ct);

            if (!response.Success)
                return BadRequest(response.ErrorMessage);

            return Ok(response.ChannelId);
        }

        [HttpPost("join-channel")]
        [AllowAnonymous]
        public async Task<IActionResult> JoinChannel([FromBody] SecretProject.Service.HttpGateway.Web.DataStore.Channel.Requests.JoinChannelRequest data, CancellationToken ct)
        {
            var response = await _channelServiceClient.JoinChannelAsync(
                new SecretProject.Service.Grpc.v1.Proto.JoinChannelRequest
                {
                    ChannelId = data.ChannelId.ToString(),
                    UserId = data.UserId
                },
                cancellationToken: ct);

            if (!response.Success)
                return BadRequest(response.ErrorMessage);

            return Ok();
        }

        [HttpDelete("delete-channel/{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> DeleteChannel([FromRoute] Guid id, CancellationToken ct)
        {
            var response = await _channelServiceClient.DeleteChannelAsync(
                new DeleteChannelRequest { ChannelId = id.ToString() },
                cancellationToken: ct);

            if (!response.Success)
                return BadRequest(response.ErrorMessage);

            return Ok(response.ChannelId);
        }

        [HttpGet("get-user-channels/{userId}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetUserChannels([FromRoute] string userId, CancellationToken ct)
        {
            var response = await _channelServiceClient.GetUserChannelsAsync(
                new GetUserChannelsRequest { UserId = userId },
                cancellationToken: ct);

            if (!response.Success)
                return NotFound(response.ErrorMessage);

            var channelsDictionary = response.Channels.ToDictionary(
                pair => pair.Key,
                pair => ChannelMapper.ToHttp(pair.Value));

            return Ok(channelsDictionary);
        }

        [HttpGet("channel/{id}/get-channel-users")]
        [AllowAnonymous]
        public async Task<IActionResult> GetChannelUsers([FromRoute] Guid id, CancellationToken ct)
        {
            var response = await _channelServiceClient.GetChannelUsersAsync(
                new GetChannelUsersRequest { ChannelId = id.ToString() },
                cancellationToken: ct);

            if (!response.Success)
                return NotFound(response.ErrorMessage);

            return Ok(response.Users.Select(UserMapper.ToDto));
        }

        [HttpPost("channel/{channelId}/add-user")]
        public async Task<IActionResult> AddUserToChannel([FromRoute] Guid channelId, [FromBody] AddNewUserToChannelRequest data, CancellationToken ct)
        {
            var response = await _channelServiceClient.AddUserToChannelAsync(
                new AddUserToChannelRequest
                {
                    ChannelId = channelId.ToString(),
                    UserId = data.UserId.ToString()
                },
                cancellationToken: ct);

            if (!response.Success)
                return BadRequest(response.ErrorMessage);

            return Ok();
        }

        [HttpDelete("channel/{channelId}/delete-user/{userId}")]
        public async Task<IActionResult> DeleteUserFromChannel([FromRoute] Guid channelId, [FromRoute] string userId, CancellationToken ct)
        {
            var response = await _channelServiceClient.DeleteUserFromChannelAsync(
                new DeleteUserFromChannelRequest
                {
                    ChannelId = channelId.ToString(),
                    UserId = userId
                },
                cancellationToken: ct);

            if (!response.Success)
                return NotFound(response.ErrorMessage);

            return Ok();
        }
    }
}

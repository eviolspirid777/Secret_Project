using Grpc.Core;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SecretProject.Data.Contracts.Channel;
using SecretProject.Service.HttpGateway.Web.DataStore.Channel.Requests;
using SecretProject.Service.HttpGateway.Web.DataStore.Common;
using SecretProject.Service.HttpGateway.Web.DataStore.Mappers.Channel;
using SecretProject.Service.HttpGateway.Web.DataStore.Mappers.Grpc;
using SecretProject.Service.HttpGateway.Web.DataStore.Mappers.User;

namespace SecretProject.Service.HttpGateway.Web.Controllers.Channel
{
    public partial class ChannelController
    {
        [HttpGet("get-channel-information/{id}")]
        public async Task<IActionResult> GetChannelInformation([FromRoute] Guid id, CancellationToken ct)
        {
            try
            {
                var response = await _channelServiceClient.GetChannelInformationAsync(
                    new GetChannelInformationRequest { ChannelId = id.ToString() },
                    cancellationToken: ct);

                if (!response.Success)
                    return NotFound(new ErrorResponse(response.ErrorMessage));

                return Ok(ChannelMapper.ToHttp(response.Channel));
            }
            catch (RpcException ex)
            {
                _logger.LogError(ex, "gRPC ошибка {UserId}", id);
                return this.ToHttpResult(ex);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Неожиданная ошибка при попытке получить информацию канала {id}", id);
                return StatusCode(500, new ErrorResponse("Internal server error")); 
            }
        }

        [HttpPost("add-channel")]
        public async Task<IActionResult> AddChannel([FromBody] AddNewChannelRequest data, CancellationToken ct)
        {
            try
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
                    return BadRequest(new ErrorResponse(response.ErrorMessage));

                return Ok(response.ChannelId);
            }
            catch (RpcException ex)
            {
                _logger.LogError(ex, "gRPC ошибка {UserId}", data.Name);
                return this.ToHttpResult(ex);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Неожиданная ошибка при попытке добавить канал {id}", data.Name);
                return StatusCode(500, new ErrorResponse("Internal server error"));
            }
            
        }

        [HttpPost("join-channel")]
        public async Task<IActionResult> JoinChannel([FromBody] DataStore.Channel.Requests.JoinChannelRequest data, CancellationToken ct)
        {
            try
            {
                var response = await _channelServiceClient.JoinChannelAsync(
                new SecretProject.Data.Contracts.Channel.JoinChannelRequest
                {
                    ChannelId = data.ChannelId.ToString(),
                    UserId = data.UserId
                },
                cancellationToken: ct);

                if (!response.Success)
                    return BadRequest(new ErrorResponse(response.ErrorMessage));

                return Ok();
            }
            catch (RpcException ex)
            {
                _logger.LogError(ex, "gRPC ошибка {id}", data.ChannelId);
                return this.ToHttpResult(ex);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Неожиданная ошибка при попытке присоединиться к каналу {id}", data.ChannelId);
                return StatusCode(500, new ErrorResponse("Internal server error"));
            }
            
        }

        [HttpDelete("delete-channel/{id}")]
        public async Task<IActionResult> DeleteChannel([FromRoute] Guid id, CancellationToken ct)
        {
            try
            {
                var response = await _channelServiceClient.DeleteChannelAsync(
                new DeleteChannelRequest { ChannelId = id.ToString() },
                cancellationToken: ct);

                if (!response.Success)
                    return BadRequest(new ErrorResponse(response.ErrorMessage));

                return Ok(response.ChannelId);
            }
            catch (RpcException ex)
            {
                _logger.LogError(ex, "gRPC ошибка {id}", id);
                return this.ToHttpResult(ex);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Неожиданная ошибка при попытке удалить канал {id}", id);
                return StatusCode(500, new ErrorResponse("Internal server error"));
            }
            
        }

        [HttpGet("get-user-channels/{userId}")]
        public async Task<IActionResult> GetUserChannels([FromRoute] string userId, CancellationToken ct)
        {
            try
            {
                var response = await _channelServiceClient.GetUserChannelsAsync(
                new GetUserChannelsRequest { UserId = userId },
                cancellationToken: ct);

                if (!response.Success)
                    return NotFound(new ErrorResponse(response.ErrorMessage));

                var channelsDictionary = response.Channels.ToDictionary(
                    pair => pair.Key,
                    pair => ChannelMapper.ToHttp(pair.Value));

                return Ok(channelsDictionary);
            }
            catch (RpcException ex)
            {
                _logger.LogError(ex, "gRPC ошибка {id}", userId);
                return this.ToHttpResult(ex);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Неожиданная ошибка при попытке получить каналы пользователя {id}", userId);
                return StatusCode(500, new ErrorResponse("Internal server error"));
            }
            
        }

        [HttpGet("channel/{id}/get-channel-users")]
        public async Task<IActionResult> GetChannelUsers([FromRoute] Guid id, CancellationToken ct)
        {
            try
            {
                var response = await _channelServiceClient.GetChannelUsersAsync(
                new GetChannelUsersRequest { ChannelId = id.ToString() },
                cancellationToken: ct);

                if (!response.Success)
                    return NotFound(new ErrorResponse(response.ErrorMessage));

                return Ok(response.Users.Select(x => x.ToDto()));
            }
            catch (RpcException ex)
            {
                _logger.LogError(ex, "gRPC ошибка {id}", id);
                return this.ToHttpResult(ex);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Неожиданная ошибка при попытке получить пользователей канала {id}", id);
                return StatusCode(500, new ErrorResponse("Internal server error"));
            }
            
        }

        [HttpPost("channel/{channelId}/add-user")]
        public async Task<IActionResult> AddUserToChannel([FromRoute] Guid channelId, [FromBody] AddNewUserToChannelRequest request, CancellationToken ct)
        {
            try
            {
                var response = await _channelServiceClient.AddUserToChannelAsync(
                new AddUserToChannelRequest
                {
                    ChannelId = channelId.ToString(),
                    UserId = request.UserId.ToString()
                },
                cancellationToken: ct);

                if (!response.Success)
                    return BadRequest(new ErrorResponse(response.ErrorMessage));

                return Ok();
            }
            catch (RpcException ex)
            {
                _logger.LogError(ex, "gRPC ошибка {id}", request.UserId);
                return this.ToHttpResult(ex);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Неожиданная ошибка при попытке добавить пользователя в канал {id}", request.UserId);
                return StatusCode(500, new ErrorResponse("Internal server error"));
            }
            
        }

        [HttpDelete("channel/{channelId}/delete-user/{userId}")]
        public async Task<IActionResult> DeleteUserFromChannel([FromRoute] Guid channelId, [FromRoute] string userId, CancellationToken ct)
        {
            try
            {
                var response = await _channelServiceClient.DeleteUserFromChannelAsync(
                                new DeleteUserFromChannelRequest
                                {
                                    ChannelId = channelId.ToString(),
                                    UserId = userId
                                },
                                cancellationToken: ct);

                if (!response.Success)
                    return NotFound(new ErrorResponse(response.ErrorMessage));

                return Ok();
            }
            catch (RpcException ex)
            {
                _logger.LogError(ex, "gRPC ошибка {id}", userId);
                return this.ToHttpResult(ex);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Неожиданная ошибка при попытке удалить пользователя из канала {id}", userId);
                return StatusCode(500, new ErrorResponse("Internal server error"));
            }
            
        }
    }
}

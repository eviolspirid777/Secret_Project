using Grpc.Core;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NSwag.Annotations;
using SecretProject.Data.Contracts.Authentication;
using SecretProject.Service.HttpGateway.Web.DataStore.Common;
using SecretProject.Service.HttpGateway.Web.DataStore.Mappers.Grpc;

namespace SecretProject.Service.HttpGateway.Web.Controllers;

public partial class AuthController
{
    [OpenApiTag("Auth")]
    [HttpPost("register")]
    [AllowAnonymous]
    [ProducesErrorResponseType(typeof(ProblemDetails))]
    [OpenApiOperation(nameof(Register), "Регистрация пользователя", "")]
    public async Task<IActionResult> Register([FromBody] RegisterRequest request, CancellationToken ct)
    {
        try
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var response = await _authClient.RegisterAsync(request, cancellationToken: ct);
            if (!response.Success)
                return BadRequest(new ErrorResponse(response.ErrorMessage));

            return Ok(new
            {
                userId = response.UserId,
                message = response.Message
            });
        }
        catch (RpcException ex)
        {
            _logger.LogError(ex, "gRPC ошибка {id}", request.Email);
            return this.ToHttpResult(ex);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Неожиданная ошибка при попытке зарегестрировать пользователя {id}", request.Email);
            return StatusCode(500, new ErrorResponse("Internal server error"));
        }
        
    }

    [HttpGet("confirm-email")]
    [AllowAnonymous]
    public async Task<IActionResult> ConfirmEmail([FromQuery] string userId, [FromQuery] string token, CancellationToken ct)
    {
        try
        {
            var response = await _authClient.ConfirmEmailAsync(
            new ConfirmEmailRequest
            {
                UserId = userId,
                Token = token
            },
            cancellationToken: ct);

            if (!response.Success)
                return BadRequest(new ErrorResponse(response.ErrorMessage));

            return Ok(new { message = response.Message });
        }
        catch (RpcException ex)
        {
            _logger.LogError(ex, "gRPC ошибка {id}", userId);
            return this.ToHttpResult(ex);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Неожиданная ошибка при попытке подтверидить почту пользователя {id}", userId);
            return StatusCode(500, new ErrorResponse("Internal server error"));
        }
        
    }

    [HttpPost("login")]
    [AllowAnonymous]
    public async Task<IActionResult> Login([FromBody] LoginRequest request, CancellationToken ct)
    {
        try
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var response = await _authClient.LoginAsync(request, cancellationToken: ct);
            if (!response.Success)
                return Unauthorized(new ErrorResponse(response.ErrorMessage));

            return Ok(new
            {
                token = response.AccessToken,
                expirationDate = DateTimeOffset.FromUnixTimeSeconds(response.ExpiresIn).UtcDateTime,
                userId = response.UserId
            });
        }
        catch (RpcException ex)
        {
            _logger.LogError(ex, "gRPC ошибка {id}", request.Email);
            return this.ToHttpResult(ex);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Неожиданная ошибка при попытке авторизовать пользователя {id}", request.Email);
            return StatusCode(500, new ErrorResponse("Internal server error"));
        }
        
    }

    [HttpPost("logout")]
    [AllowAnonymous]
    public async Task<IActionResult> Logout([FromQuery] string id, CancellationToken ct)
    {
        try
        {
            var response = await _authClient.LogoutAsync(new LogoutRequest { UserId = id }, cancellationToken: ct);
            if (!response.Success)
                return BadRequest(new ErrorResponse(response.Message));

            return Ok();
        }
        catch (RpcException ex)
        {
            _logger.LogError(ex, "gRPC ошибка {id}", id);
            return this.ToHttpResult(ex);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Неожиданная ошибка при попытке логаута пользователя {id}", id);
            return StatusCode(500, new ErrorResponse("Internal server error"));
        }
    }

    [HttpDelete("delete")]
    [AllowAnonymous]
    public async Task<IActionResult> DeleteAccount([FromQuery] string id, CancellationToken ct)
    {
        try
        {
            var response = await _authClient.DeleteAccountAsync(new DeleteAccountRequest { UserId = id }, cancellationToken: ct);
            if (!response.Success)
                return BadRequest(new ErrorResponse(response.ErrorMessage));

            return Ok();
        }
        catch (RpcException ex)
        {
            _logger.LogError(ex, "gRPC ошибка {id}", id);
            return this.ToHttpResult(ex);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Неожиданная ошибка при попытке удаления пользователя {id}", id);
            return StatusCode(500, new ErrorResponse("Internal server error"));
        }
        
    }
}

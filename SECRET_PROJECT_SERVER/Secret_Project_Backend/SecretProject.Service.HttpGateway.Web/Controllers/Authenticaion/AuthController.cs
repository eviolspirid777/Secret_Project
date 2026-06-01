using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NSwag.Annotations;
using SecretProject.Data.Contracts.Authentication;

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
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var response = await _authClient.RegisterAsync(request, cancellationToken: ct);
        if (!response.Success)
            return BadRequest(response.ErrorMessage);

        return Ok(new
        {
            userId = response.UserId,
            message = response.Message
        });
    }

    [HttpGet("confirm-email")]
    [AllowAnonymous]
    public async Task<IActionResult> ConfirmEmail([FromQuery] string userId, [FromQuery] string token, CancellationToken ct)
    {
        var response = await _authClient.ConfirmEmailAsync(
            new ConfirmEmailRequest
            {
                UserId = userId,
                Token = token
            },
            cancellationToken: ct);

        if (!response.Success)
            return BadRequest(response.ErrorMessage);

        return Ok(new { message = response.Message });
    }

    [HttpPost("login")]
    [AllowAnonymous]
    public async Task<IActionResult> Login([FromBody] LoginRequest request, CancellationToken ct)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var response = await _authClient.LoginAsync(request, cancellationToken: ct);
        if (!response.Success)
            return Unauthorized(response.ErrorMessage);

        return Ok(new
        {
            token = response.AccessToken,
            expirationDate = DateTimeOffset.FromUnixTimeSeconds(response.ExpiresIn).UtcDateTime,
            userId = response.UserId
        });
    }

    [HttpPost("logout")]
    [AllowAnonymous]
    public async Task<IActionResult> Logout([FromQuery] string id, CancellationToken ct)
    {
        var response = await _authClient.LogoutAsync(new LogoutRequest { UserId = id }, cancellationToken: ct);
        if (!response.Success)
            return BadRequest(response.Message);

        return Ok();
    }

    [HttpDelete("delete")]
    [AllowAnonymous]
    public async Task<IActionResult> DeleteAccount([FromQuery] string id, CancellationToken ct)
    {
        var response = await _authClient.DeleteAccountAsync(new DeleteAccountRequest { UserId = id }, cancellationToken: ct);
        if (!response.Success)
            return BadRequest(response.ErrorMessage);

        return Ok();
    }
}

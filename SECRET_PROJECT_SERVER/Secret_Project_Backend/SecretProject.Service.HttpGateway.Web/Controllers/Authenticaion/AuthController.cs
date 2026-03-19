using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using NSwag.Annotations;
using SecretProject.Service.Grpc.v1.Proto;
using Microsoft.AspNetCore.Authorization;
using SecretProject.Platform.Data.DataStore.Entities;

namespace SecretProject.Service.HttpGateway.Web.Controllers;

public partial class AuthController
{
    [OpenApiTag("Auth")]
    [HttpPost("register")]
    [AllowAnonymous]
    [ProducesResponseType(typeof(Guid), 200)]
    [ProducesErrorResponseType(typeof(ProblemDetails))]
    [OpenApiOperation(nameof(Register), "Регистрация пользователя", "")]
    public async Task<IActionResult> Register([FromBody] RegisterRequest request, CancellationToken ct)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var foundedUser = await _userManager.FindByEmailAsync(request.Email);

        if (foundedUser != null)
            return BadRequest("Пользователь с такой почтой уже существует");

        var user = new AuthUser
        {
            UserName = request.Email,
            Email = request.Email,
            DisplayName = string.IsNullOrEmpty(request.DisplayName) ? request.Email : request.DisplayName,
            AvatarUrl = "",
            EmailConfirmed = false,
        };

        var result = await _userManager.CreateAsync(user, request.Password);
        if (!result.Succeeded)
            return BadRequest(result.Errors);

        var token = await _userManager.GenerateEmailConfirmationTokenAsync(user);

        try
        {
            var emailRequest = new SendEmailConfirmationRequest() { Email =  user.Email, UserId = user.Id, Token = token};
            await _emailServiceClient.SendEmailConfirmationAsync(emailRequest, cancellationToken: ct);
            _logger.LogInformation($"Пользователь с почтой: {user.Email} отправлен на подтверждение email.");
            return Ok(new
            {
                message = "Для завершения регистрации проверьте вашу почту и подтвердите учётную запись"
            });
        }
        catch (Exception ex)
        {
            await _userManager.DeleteAsync(user);
            _logger.LogError(ex.Message);
            return StatusCode(500, "Ошибка при отправке письма подтверждения. Пожалуйста, попробуйте позже.");
        }
    }

    [HttpGet("confirm-email")]
    [AllowAnonymous]
    public async Task<IActionResult> ConfirmEmail([FromQuery] string UserId, [FromQuery] string Token)
    {
        var user = await _userManager.FindByIdAsync(UserId);
        if (user == null)
        {
            return BadRequest("Пользователь не найден!");
        }

        var result = await _userManager.ConfirmEmailAsync(user, Token);
        if (result.Succeeded)
        {
            //var (token, expirationDate) = JwtToken.GenerateJwtToken(user, _configuration["Jwt:Key"]);
            _logger.LogInformation($"Пользователь {user.Email} успешно прошел подтверждение почты!");
            return Ok(new
            {
                message = "Email подтвержден!",
                //token,
                //expirationDate
            });
        }
        else
        {
            return BadRequest("Ошибка при подтверждении email");
        }
    }

    //[HttpPost("login")]
    //public async Task<IActionResult> Login([FromBody] LoginDto model)
    //{
    //    if (!ModelState.IsValid)
    //        return BadRequest(ModelState);

    //    var user = await _userManager.FindByEmailAsync(model.Email);
    //    if (user == null)
    //        return Unauthorized("Неверные данные для входа");

    //    if (!await _userManager.IsEmailConfirmedAsync(user))
    //    {
    //        return Unauthorized("Email не подтвержден. Пожалуйста, подтвердите email для входа.");
    //    }

    //    var result = await _signInManager.CheckPasswordSignInAsync(user, model.Password, false);

    //    if (!result.Succeeded)
    //        return Unauthorized("Неверные учетные данные");

    //    var (token, expirationDate) = JwtToken.GenerateJwtToken(user, _configuration["Jwt:Key"]);
    //    await _userStatusService.ChangeStatusAsync(Models.ConnectionState.Online, user.Id);
    //    return Ok(new { token, expirationDate, userId = user.Id });
    //}

    //[HttpPost("logout")]
    //public async Task<IActionResult> Logout([FromQuery] string id)
    //{
    //    var user = await _userManager.FindByIdAsync(id);
    //    if (user == null)
    //    {
    //        return BadRequest("Invalid user access!");
    //    }

    //    await _userStatusService.ChangeStatusAsync(Models.ConnectionState.Offline, user.Id);
    //    await _signInManager.SignOutAsync();
    //    return Ok();
    //}
}

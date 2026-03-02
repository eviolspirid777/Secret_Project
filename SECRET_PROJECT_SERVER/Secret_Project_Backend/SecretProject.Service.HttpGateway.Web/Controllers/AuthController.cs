using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using SecretProject.Platform.Data.DTOs;
using SecretProject.Service.HttpGateway.Web.DataStore.Models;
using SecretProject.Service.HttpGateway.Web.Utils;

namespace SecretProject.Service.HttpGateway.Web.Controllers;

[ApiController]
[Route("[controller]")]
public class AuthController : ControllerBase
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly SignInManager<ApplicationUser> _signInManager;
    private readonly IConfiguration _configuration;
    private readonly IEmailService _emailService;
    private readonly ChangeUserStatusService _userStatusService;
    private readonly IJwtTokenGenerator _jwtTokenGenerator;
    private readonly ILogger<AuthController> _logger;

    public AuthController(
        SignInManager<ApplicationUser> signInManager,
        UserManager<ApplicationUser> userManager,
        IConfiguration configuration,
        IEmailService emailService,
        ChangeUserStatusService userStatusService,
        IJwtTokenGenerator jwtTokenGenerator,
        ILogger<AuthController> logger
    )
    {
        _signInManager = signInManager;
        _userManager = userManager;
        _configuration = configuration;
        _emailService = emailService;
        _userStatusService = userStatusService;
        _jwtTokenGenerator = jwtTokenGenerator;
        _logger = logger;
    }

    //[HttpDelete("delete-user")]
    //public async Task<IActionResult> DeleteAccout([FromQuery] string id)
    //{
    //    var user = await _userManager.FindByIdAsync(id);
    //    if(user == null)
    //    {
    //        return BadRequest("Invalid UserData");
    //    }
    //    await _userManager.DeleteAsync(user);
    //    return Ok();
    //}

    [HttpPost("register")]
    public async Task<ActionResult> Register([FromBody] RegisterDto model)
    {
        if(!ModelState.IsValid)
            return BadRequest(ModelState);
        var foundedUser = await _userManager.FindByEmailAsync(model.Email);
        if (foundedUser != null)
            return BadRequest("Пользователь с таким именем уже существует");

        var user = new ApplicationUser
        {
            UserName = model.Email,
            Email = model.Email,
            DisplayName = model.Email.Split("@")[0],
            AvatarUrl = "",
            EmailConfirmed = false,
            Status = ConnectionState.Offline,
        };

        var result = await _userManager.CreateAsync(user, model.Password);

        if (!result.Succeeded)
            return BadRequest(result.Errors);

        var token = await _userManager.GenerateEmailConfirmationTokenAsync(user);
        
        try
        {
            await _emailService.SendEmailConfirmationAsync(user.Email, user.Id, token);
            _logger.LogInformation($"Пользователь с почтой: {user.Email} отправлен на подтверждение email.");
            return Ok(new { 
                message = "Для завершения регистрации проверьте вашу почту и подтвердите email"
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
    public async Task<IActionResult> ConfirmEmail([FromQuery] string UserId, [FromQuery] string Token)
    {
        var user = await _userManager.FindByIdAsync(UserId);
        if(user == null)
        {
            return BadRequest("Пользователь не найден!");
        }

        var result = await _userManager.ConfirmEmailAsync(user, Token);
        if(result.Succeeded)
        {
            //var (token, expirationDate) = JwtToken.GenerateJwtToken(user, _configuration["Jwt:Key"]);
            _logger.LogInformation($"Пользователь {user.Email} успешно прошел подтверждение почты!");
            return Ok(new { 
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

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDto model)
    {
        if(!ModelState.IsValid) 
            return BadRequest(ModelState);

        var user = await _userManager.FindByEmailAsync(model.Email);
        if (user == null)
            return Unauthorized("Неверные данные для входа");

        if (!await _userManager.IsEmailConfirmedAsync(user))
        {
            return Unauthorized("Email не подтвержден. Пожалуйста, подтвердите email для входа.");
        }

        var result = await _signInManager.CheckPasswordSignInAsync(user, model.Password, false);

        if (!result.Succeeded)
            return Unauthorized("Неверные учетные данные");

        var (token, expirationDate) = _jwtTokenGenerator.GenerateJwtToken(user, _configuration["Jwt:Key"]);
        await _userStatusService.ChangeStatusAsync(ConnectionState.Online, user.Id);
        return Ok(new { token, expirationDate, userId = user.Id });
    }

    [HttpPost("logout")]
    public async Task<IActionResult> Logout([FromQuery] string id)
    {
        var user = await _userManager.FindByIdAsync(id);
        if(user == null)
        {
            return BadRequest("Invalid user access!");
        }

        await _userStatusService.ChangeStatusAsync(ConnectionState.Offline, user.Id);
        await _signInManager.SignOutAsync();
        return Ok();
    }
}

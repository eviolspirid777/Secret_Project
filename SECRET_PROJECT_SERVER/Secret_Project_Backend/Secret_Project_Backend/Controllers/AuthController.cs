using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Secret_Project_Backend.Controllers.Requests.Auth;
using Secret_Project_Backend.DTOs;
using Secret_Project_Backend.Models;
using Secret_Project_Backend.Services;
using Secret_Project_Backend.Utils;

namespace Secret_Project_Backend.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly IConfiguration _configuration;
        private readonly IEmailService _emailService;

        public AuthController(
            SignInManager<ApplicationUser> signInManager,
            UserManager<ApplicationUser> userManager,
            IConfiguration configuration,
            IEmailService emailService
        )
        {
            _signInManager = signInManager;
            _userManager = userManager;
            _configuration = configuration;
            _emailService = emailService;
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

            var user = new ApplicationUser
            {
                UserName = model.DisplayName,
                Email = model.Email,
                DisplayName = model.DisplayName,
                AvatarUrl = "",
                EmailConfirmed = false,
            };

            var result = await _userManager.CreateAsync(user, model.Password);

            if (!result.Succeeded)
                return BadRequest(result.Errors);

            var token = await _userManager.GenerateEmailConfirmationTokenAsync(user);
            
            try
            {
                await _emailService.SendEmailConfirmationAsync(user.Email, user.Id, token);
                return Ok(new { 
                    message = "Для завершения регистрации проверьте вашу почту и подтвердите email"
                });
            }
            catch (Exception)
            {
                await _userManager.DeleteAsync(user);
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

            var (token, expirationDate) = JwtToken.GenerateJwtToken(user, _configuration["Jwt:Key"]);
            return Ok(new { token, expirationDate });
        }

        [HttpPost("logout")]
        public async Task<IActionResult> Logout()
        {
            await _signInManager.SignOutAsync();
            return Unauthorized();
        }
    }
}

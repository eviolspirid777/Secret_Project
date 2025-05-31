using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Secret_Project_Backend.Context;
using Secret_Project_Backend.DTOs;
using Secret_Project_Backend.Mappers.User;
using Secret_Project_Backend.Models;

namespace Secret_Project_Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly PostgreSQLDbContext _dbContext;
        private readonly UserManager<ApplicationUser> _userManager;
        public UserController(
            PostgreSQLDbContext dbContext,
            UserManager<ApplicationUser> userManager
        )
        {
            _dbContext = dbContext;
            _userManager = userManager;
        }

        [Authorize]
        [HttpGet]
        public async Task<IActionResult> GetUserInformation([FromQuery] string id)
        {
            var user = await _dbContext.Users.FirstOrDefaultAsync(user => user.Id == id);
            if(user == null)
            {
                return BadRequest("User was not found");
            }
            var mappedUser = UserMapper.MapUserToUserDto(user, id);
            return Ok(mappedUser);
        }
    }
}

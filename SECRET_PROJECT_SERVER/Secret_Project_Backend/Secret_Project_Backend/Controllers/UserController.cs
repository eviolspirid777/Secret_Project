using System.Data.Entity;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Secret_Project_Backend.Context;

namespace Secret_Project_Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly PostgreSQLDbContext _dbContext;
        public UserController(
            PostgreSQLDbContext dbContext
        )
        {
            _dbContext = dbContext;
        }
    }
}

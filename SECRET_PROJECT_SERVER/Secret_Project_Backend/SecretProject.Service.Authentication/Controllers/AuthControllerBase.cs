using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using NSwag.Annotations;
using SecretProject.Authentication.Data.DataStore.Entities;
using SecretProject.Service.Grpc.v1.Proto;

namespace SecretProject.Service.Authentication.Controllers
{

    [OpenApiController("Auth")]
    [Route("/v1/auth")]
    [Authorize]
    public partial class AuthController : ControllerBase
    {
        private readonly ILogger<AuthController> _logger;
        private readonly UserManager<AuthUser> _userManager;
        private readonly SignInManager<AuthUser> _signInManager;
        private readonly IConfiguration _configuration;
        private readonly EmailService.EmailServiceClient _emailServiceClient;
        public AuthController(ILogger<AuthController> logger,
                              UserManager<AuthUser> userManager,
                              SignInManager<AuthUser> signInManager,
                              IConfiguration configuration,
                              EmailService.EmailServiceClient emailServiceClient)
        {
            _logger = logger;
            _userManager = userManager;
            _signInManager = signInManager;
            _configuration = configuration;
            _emailServiceClient = emailServiceClient;
        }
    }
}

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using NSwag.Annotations;
using SecretProject.Service.Grpc.v1.Proto;
using SecretProject.Service.HttpGateway.Web.DataStore.Authentication.Entities;

namespace SecretProject.Service.HttpGateway.Web.Controllers;


[OpenApiController("Auth")]
[Route("/v1/auth")]
[Authorize]
public partial class AuthController(
ILogger<AuthController> logger,
UserManager<AuthUser> userManager,
SignInManager<AuthUser> signInManager,
IConfiguration configuration,
EmailService.EmailServiceClient emailServiceClient) : ControllerBase
{
    private readonly ILogger<AuthController> _logger = logger;
    private readonly UserManager<AuthUser> _userManager = userManager;
    private readonly SignInManager<AuthUser> _signInManager = signInManager;
    private readonly IConfiguration _configuration = configuration;
    private readonly EmailService.EmailServiceClient _emailServiceClient = emailServiceClient;
}

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NSwag.Annotations;
using SecretProject.Data.Contracts.Authentication;


namespace SecretProject.Service.HttpGateway.Web.Controllers;

[OpenApiController("Auth")]
[Route("/v1/auth")]
[Authorize]
public partial class AuthController(
    ILogger<AuthController> logger,
    AuthService.AuthServiceClient authClient) : ControllerBase
{
    private readonly ILogger<AuthController> _logger = logger;
    private readonly AuthService.AuthServiceClient _authClient = authClient;
}

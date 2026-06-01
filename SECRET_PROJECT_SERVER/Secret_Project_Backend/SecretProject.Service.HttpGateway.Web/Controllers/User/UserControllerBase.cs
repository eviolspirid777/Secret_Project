using Microsoft.AspNetCore.Authorization;
using NSwag.Annotations;
using Microsoft.AspNetCore.Mvc;
using SecretProject.Data.Contracts.User;


namespace SecretProject.Service.HttpGateway.Web.Controllers.User
{
    [OpenApiController("User")]
    [Route("/v1/user")]
    public partial class UserController(ILogger<UserController> logger, UserService.UserServiceClient userServiceClient) : ControllerBase
    {
        private readonly ILogger<UserController> _logger = logger;
        private readonly UserService.UserServiceClient _userServiceClient = userServiceClient;
    }
}

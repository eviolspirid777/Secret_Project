using Microsoft.AspNetCore.Authorization;
using NSwag.Annotations;
using Microsoft.AspNetCore.Mvc;
using SecretProject.Service.Grpc.v1.Proto;


namespace SecretProject.Service.HttpGateway.Web.Controllers.User
{
    [OpenApiController("Channel")]
    [Route("/v1/user")]
    [Authorize]
    public partial class UserController(ILogger<UserController> logger) : ControllerBase
    {
        private readonly ILogger<UserController> _logger = logger;
    }
}

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NSwag.Annotations;
using SecretProject.Platform.Data.DataStore.Context;
using SecretProject.Service.Grpc.v1.Proto;

namespace SecretProject.Service.HttpGateway.Web.Controllers.Channel
{
    [OpenApiController("Channel")]
    [Route("/v1/channel")]
    [Authorize]
    public partial class ChannelController(ILogger<ChannelController> logger, ChannelDbContext dbContext, AuthService.AuthServiceClient authServiceClient) : ControllerBase
    {
        private readonly ILogger<ChannelController> _logger = logger;
        private readonly ChannelDbContext _dbContext = dbContext;
        private readonly AuthService.AuthServiceClient _authServiceClient = authServiceClient;
    }
}

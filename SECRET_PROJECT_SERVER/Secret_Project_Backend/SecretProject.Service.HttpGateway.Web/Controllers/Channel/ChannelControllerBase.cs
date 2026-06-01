using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NSwag.Annotations;
using SecretProject.Data.Contracts.Channel;

namespace SecretProject.Service.HttpGateway.Web.Controllers.Channel
{
    [OpenApiController("Channel")]
    [Route("/v1/channel")]
    [Authorize]
    public partial class ChannelController(
        ILogger<ChannelController> logger,
        ChannelService.ChannelServiceClient channelServiceClient) : ControllerBase
    {
        private readonly ILogger<ChannelController> _logger = logger;
        private readonly ChannelService.ChannelServiceClient _channelServiceClient = channelServiceClient;
    }
}

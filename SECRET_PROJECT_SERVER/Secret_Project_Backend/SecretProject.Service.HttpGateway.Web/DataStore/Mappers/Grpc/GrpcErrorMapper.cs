using Grpc.Core;
using Microsoft.AspNetCore.Mvc;
using SecretProject.Service.HttpGateway.Web.DataStore.Common;

namespace SecretProject.Service.HttpGateway.Web.DataStore.Mappers.Grpc
{
    public static class GrpcErrorMapper
    {
        public static IActionResult ToHttpResult(this ControllerBase controller, RpcException exception)
        {
            var message = string.IsNullOrWhiteSpace(exception.Status.Detail)
                ? "Request failed"
                : exception.Status.Detail;

            return exception.StatusCode switch
            {
                StatusCode.InvalidArgument => controller.BadRequest(new ErrorResponse(message)),
                StatusCode.NotFound => controller.NotFound(new ErrorResponse(message)),
                StatusCode.Unauthenticated => controller.Unauthorized(new ErrorResponse(message)),
                StatusCode.PermissionDenied => controller.StatusCode(403, new ErrorResponse(message)),
                StatusCode.Unavailable => controller.StatusCode(503, new ErrorResponse("Service is unavailable")),
                _ => controller.StatusCode(500, new ErrorResponse("Internal server error"))
            };
        }
    }
}

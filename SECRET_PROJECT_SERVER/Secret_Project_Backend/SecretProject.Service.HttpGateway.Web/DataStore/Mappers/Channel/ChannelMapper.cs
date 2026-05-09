using SecretProject.Service.Grpc.v1.Proto;
using SecretProject.Service.HttpGateway.Web.DataStore.Channel.Responses;

namespace SecretProject.Service.HttpGateway.Web.DataStore.Mappers.Channel
{
    public static class ChannelMapper
    {
        public static ChannelDto ToHttp(ChannelView data)
        {
            return new ChannelDto
            {
                Id = data.Id,
                Name = data.Name,
                ChannelAvatarUrl = data.ChannelAvatarUrl,
                CreatedAt = DateTime.TryParse(data.CreatedAtUtc, out var createdAt)
                    ? createdAt
                    : DateTime.MinValue
            };
        }
    }
}

using SecretProject.Data.Contracts.Channel;
using SecretProject.Service.HttpGateway.Web.DataStore.User.Responses;

namespace SecretProject.Service.HttpGateway.Web.DataStore.Mappers.User
{
    public static class UserMapper
    {
        public static UserDto ToDto(this ChannelUserView source)
        {
            return new UserDto
            {
                UserId = Guid.TryParse(source.Id, out var userId) ? userId : Guid.Empty,
                Name = source.Name,
                Avatar = source.Avatar,
                Email = source.Email,
                Status = source.Status,
                States = new SoundConnectionStateDto
                {
                    IsMicrophoneMuted = source.IsMicroMuted,
                    IsHeadphonesMuted = source.IsHeadphonesMuted
                }
            };
        }
    }
}

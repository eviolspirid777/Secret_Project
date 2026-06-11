using SecretProject.Data.Contracts.Channel;
using SecretProject.Data.Contracts.User;
using SecretProject.Service.HttpGateway.Web.DataStore.User.Requests;
using SecretProject.Service.HttpGateway.Web.DataStore.User.Responses;

namespace SecretProject.Service.HttpGateway.Web.DataStore.Mappers.User
{
    public static class UserMapper
    {
        //TODO: заглушка на стейты
        public static DataStore.User.Responses.UserDto ToDto(this Data.Contracts.User.UserDto source)
        {
            return new()
            {
                UserId = Guid.TryParse(source.Id, out var userId) ? userId : Guid.Empty,
                Name = source.Name,
                Avatar = source.Avatar,
                Email = source.Email,
                Status = source.Status,
                States = new SoundConnectionStateDto
                {
                    IsMicrophoneMuted = false,
                    IsHeadphonesMuted = false
                }
            };
        }
        
        public static DataStore.User.Responses.UserDto ToDto(this ChannelUserView source)
        {
            return new DataStore.User.Responses.UserDto
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

        public static ChangeUserStatusRequest ToGrpc(this ChangeUserStatusHttpRequest request)
        {
            return new ChangeUserStatusRequest
            {
                UserId = request.UserId,
                Status = request.Status
            };
        }

        public static ChangeUserInformationRequest ToGrpc(this ChangeUserInformationHttpRequest request)
        {
            return new ChangeUserInformationRequest
            {
                UserId = request.UserId,
                Avatar = Google.Protobuf.ByteString.CopyFrom(request.Avatar),
                Name = request.Name
            };
        }

        public static SendFriendRequestRequest ToSendFriendRequestGrpc(this FriendActionHttpRequest request)
        {
            return new SendFriendRequestRequest
            {
                FromUserId = request.FromUserId,
                ToUserId = request.ToUserId
            };
        }

        public static AcceptFriendRequestRequest ToAcceptFriendRequestGrpc(this FriendActionHttpRequest request)
        {
            return new AcceptFriendRequestRequest
            {
                FromUserId = request.FromUserId,
                ToUserId = request.ToUserId
            };
        }

        public static DeclineFriendRequestRequest ToDeclineFriendRequestGrpc(this FriendActionHttpRequest request)
        {
            return new DeclineFriendRequestRequest
            {
                FromUserId = request.FromUserId,
                ToUserId = request.ToUserId
            };
        }

        public static DeleteFriendRequestRequest ToDeleteFriendRequestGrpc(this FriendActionHttpRequest request)
        {
            return new DeleteFriendRequestRequest
            {
                FromUserId = request.FromUserId,
                ToUserId = request.ToUserId
            };
        }
    }
}

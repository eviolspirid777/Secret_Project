using Riok.Mapperly.Abstractions;
using SecretProject.Data.Contracts.User;
using SecretProject.User.Data.DataStore.Entities;
using System.Diagnostics.Tracing;
using System.Runtime.Versioning;

namespace SecretProject.Service.User.Storage.Mappers
{
    [Mapper(EnumMappingStrategy = EnumMappingStrategy.ByName)]

    #region ToGrpc
    public static partial class FriendshipMapper
    {
        public static GetFriendRequestsResponse ToGrpc(this List<UserProfile> source)
        {
            var friendList = new List<UserDto>();
            foreach(var user in source)
            {
                var mappedUser = user.ToGrpcPublic();
                friendList.Add(mappedUser);
            }
            return new() { Users = { friendList } };
        }

        public static UserDto ToGrpcPublic(this UserProfile source)
        {
            return new()
            {
                Id = source.Id.ToString(),
                Email = "Надо расширить сущность",
                Avatar = source.AvatarFileId.ToString(),
                Name = source.Name,
                SoundState = new SoundConnectionState(),
                Status = source.PresenceState.ToString()
            };
        }
    }

    #endregion
}

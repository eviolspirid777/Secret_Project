using Riok.Mapperly.Abstractions;
using Secret_Project_Backend.DTOs;
using Secret_Project_Backend.DTOs.User;
using Secret_Project_Backend.Models;

namespace Secret_Project_Backend.Mappers.FriendShip
{
    [Mapper]
    public static partial class FriendShipMapper
    {
        [MapperIgnoreSource(nameof(Friendship.Id))]
        [MapperIgnoreSource(nameof(Friendship.Status))]
        private static partial FriendshipDto Map(Friendship sourse);

        public static FriendshipDto MapFriendshipToFriendshipDto(Friendship sourse)
        {
            var user = new UserDTO() {
                UserId = sourse.User.Id,
                Avatar = sourse.User.AvatarUrl ?? "",
                States = new SoundConnectionState() {
                    IsHeadphonesMuted = sourse.User.IsHeadphonesMuted,
                    IsMicrophoneMuted = sourse.User.IsMicrophoneMuted
                },
                Email = sourse.User.Email ?? "",
                Name = sourse.User.DisplayName,
                Status = sourse.User.Status.ToString()
            };

            var friend = new UserDTO()
            {
                UserId = sourse.Friend.Id,
                Avatar = sourse.Friend.AvatarUrl ?? "",
                States = new SoundConnectionState()
                {
                    IsHeadphonesMuted = sourse.Friend.IsHeadphonesMuted,
                    IsMicrophoneMuted = sourse.Friend.IsMicrophoneMuted
                },
                Email = sourse.Friend.Email ?? "",
                Name = sourse.Friend.DisplayName,
                Status = sourse.Friend.Status.ToString()
            };
            var target = Map(sourse);
            target.Friend = friend;
            target.User = user;
            target.Id = sourse.Id;
            return target;
        }
    }
}

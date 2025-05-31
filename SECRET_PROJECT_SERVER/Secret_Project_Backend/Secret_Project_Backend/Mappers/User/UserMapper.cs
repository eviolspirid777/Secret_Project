using Riok.Mapperly.Abstractions;
using Secret_Project_Backend.DTOs;
using Secret_Project_Backend.Models;

namespace Secret_Project_Backend.Mappers.User
{
    [Mapper]
    public static partial class UserMapper
    {
        [MapProperty(nameof(ApplicationUser.Id), nameof(UserDTO.UserId))]
        //[MapperIgnoreSource(nameof(ApplicationUser.Id))]
        [MapProperty(nameof(ApplicationUser.DisplayName), nameof(UserDTO.Name))]
        [MapProperty(nameof(ApplicationUser.AvatarUrl), nameof(UserDTO.Avatar))]
        [MapProperty(nameof(ApplicationUser.IsHeadphonesMuted), nameof(UserDTO.States.IsHeadphonesMuted))]
        [MapProperty(nameof(ApplicationUser.IsMicrophoneMuted), nameof(UserDTO.States.IsMicrophoneMuted))]
        [MapperIgnoreSource(nameof(ApplicationUser.Messages))]
        private static partial UserDTO UserToUserDto(ApplicationUser source);
    
        public static UserDTO MapUserToUserDto(ApplicationUser source, string id)
        {
            var target = UserToUserDto(source);
            target.UserId = id;
            return target;
        }
    }

}

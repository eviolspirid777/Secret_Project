using Riok.Mapperly.Abstractions;
using Secret_Project_Backend.DTOs;
using Secret_Project_Backend.Models;

namespace Secret_Project_Backend.Mappers.User
{
    [Mapper]
    public static partial class UserMapper
    {
        [MapProperty(nameof(ApplicationUser.Id), nameof(UserDTO.UserId))]
        [MapProperty(nameof(ApplicationUser.DisplayName), nameof(UserDTO.Name))]
        [MapProperty(nameof(ApplicationUser.AvatarUrl), nameof(UserDTO.Avatar))]
        [MapProperty(nameof(ApplicationUser.IsHeadphonesMuted), nameof(UserDTO.ConnectionState.IsHeadphonesMuted))]
        [MapProperty(nameof(ApplicationUser.IsMicrophoneMuted), nameof(UserDTO.ConnectionState.IsMicrophoneMuted))]
        [MapperIgnoreSource(nameof(ApplicationUser.Status))]
        [MapperIgnoreSource(nameof(ApplicationUser.Messages))]
        private static partial UserDTO UserToUserDto(ApplicationUser source);
    
        public static UserDTO MapUserToUserDto(ApplicationUser source, string id)
        {
            var target = UserToUserDto(source);
            target.Status = source.Status.ToString();
            target.UserId = id;
            return target;
        }
    }

}

using Riok.Mapperly.Abstractions;
using SecretProject.Platform.Data.DTOs.User;
using SecretProject.Platform.Data.Models;


namespace SecretProject.Service.HttpGateway.Web.DataStore.Mappers.User;

[Mapper]
public static partial class UserMapper
{
    [MapProperty(nameof(ApplicationUser.Id), nameof(UserDTO.UserId))]
    [MapProperty(nameof(ApplicationUser.DisplayName), nameof(UserDTO.Name))]
    [MapProperty(nameof(ApplicationUser.AvatarUrl), nameof(UserDTO.Avatar))]
    [MapProperty(nameof(ApplicationUser.IsHeadphonesMuted), nameof(UserDTO.States.IsHeadphonesMuted))]
    [MapProperty(nameof(ApplicationUser.IsMicrophoneMuted), nameof(UserDTO.States.IsMicrophoneMuted))]
    [MapperIgnoreSource(nameof(ApplicationUser.Status))]
    [MapperIgnoreSource(nameof(ApplicationUser.ChannelMessages))]
    private static partial UserDTO UserToUserDto(ApplicationUser source);
    [MapProperty(nameof(ApplicationUser.Id), nameof(UserShortDto.Id))]
    [MapProperty(nameof(ApplicationUser.DisplayName), nameof(UserShortDto.Name))]
    [MapProperty(nameof(ApplicationUser.AvatarUrl), nameof(UserShortDto.Avatar))]
    [MapperIgnoreSource(nameof(ApplicationUser.Status))]
    [MapperIgnoreSource(nameof(ApplicationUser.Id))]
    private static partial UserShortDto UserToUserShortDto(ApplicationUser source);

    private static T MapProperties<T>(T target, ApplicationUser source) where T : class
    {
        if(target is UserShortDto UserShortDto)
        {
            UserShortDto.Status = source.Status.ToString();
            UserShortDto.Id = source.Id;
        } else if (target is UserDTO UserDto)
        {
            UserDto.Status = source.Status.ToString();
            UserDto.UserId = source.Id;
        }

        return target;
    }
    public static UserDTO MapUserToUserDto(ApplicationUser source, string id)
    {
        var target = UserToUserDto(source);
        var res = MapProperties(target, source);
        return res;
    }

    public static UserShortDto MapUserToUserShortDto(ApplicationUser source)
    {
        var target = UserToUserShortDto(source);
        var res = MapProperties(target, source);
        return res;
    }
}

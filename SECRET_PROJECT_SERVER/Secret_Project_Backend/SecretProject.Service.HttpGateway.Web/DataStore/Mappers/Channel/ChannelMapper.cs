using Riok.Mapperly.Abstractions;
using SecretProject.Platform.Data.DTOs;
using SecretProject.Platform.Data.DTOs.ChannelUser;
using SecretProject.Service.HttpGateway.Web.DataStore.Models;


namespace SecretProject.Service.HttpGateway.Web.DataStore.Mappers.Channel;

[Mapper(EnumMappingStrategy = EnumMappingStrategy.ByName)]
public static partial class ChannelMapper
{
    [MapperIgnoreTarget(nameof(Models.Channel.ChannelUsers))]
    [MapperIgnoreTarget(nameof(Models.Channel.ChannelMessages))]
    [MapperIgnoreTarget(nameof(Models.Channel.Id))]
    private static partial Models.Channel ChannelDtoToChannel(ChannelDto data);

    [MapperIgnoreSource(nameof(Models.Channel.Id))]
    private static partial ChannelDto Map(Models.Channel channel);

    [MapProperty(nameof(ChannelUser.User.DisplayName), nameof(ChannelUserDto.UserName))]
    [MapProperty(nameof(ChannelUser.User.AvatarUrl), nameof(ChannelUserDto.AvatarUrl))]
    [MapperIgnoreSource(nameof(ChannelUser.Role))]
    private static partial ChannelUserDto Map(ChannelUser source);

    public static Models.Channel ChannelDtoToChannelCustom(ChannelDto data)
    {
        var dto = ChannelDtoToChannel(data);
        dto.Id = Guid.NewGuid();
        return dto;
    }

    public static ChannelDto ChannelToChannelDto(Models.Channel data)
    {
        var dto = Map(data);
        dto.Id = data.Id.ToString();
        return dto;
    }

    public static ChannelUserDto MapChannelUserToChannelUserDto(ChannelUser source)
    {
        var target = Map(source);
        target.Role = source.Role.ToString();
        target.Status = source.User.Status.ToString();

        return target;
    }
}

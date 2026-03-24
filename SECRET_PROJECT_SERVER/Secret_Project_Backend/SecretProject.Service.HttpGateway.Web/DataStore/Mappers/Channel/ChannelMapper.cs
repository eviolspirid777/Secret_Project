using Riok.Mapperly.Abstractions;
using SecretProject.Platform.Data.DataStore.DTOs;
using SecretProject.Platform.Data.DataStore.DTOs.ChannelUser;
using SecretProject.Platform.Data.DataStore.Models;
using Entities = SecretProject.Platform.Data.DataStore.Entities;

namespace SecretProject.Service.HttpGateway.Web.DataStore.Mappers.Channel
{
    [Mapper(EnumMappingStrategy = EnumMappingStrategy.ByName)]
    public static partial class ChannelMapper
    {
        [MapperIgnoreTarget(nameof(Entities.Channel.ChannelUsers))]
        [MapperIgnoreTarget(nameof(Entities.Channel.ChannelMessages))]
        [MapperIgnoreTarget(nameof(Entities.Channel.AdminId))]
        [MapperIgnoreTarget(nameof(Entities.Channel.Room))]
        [MapperIgnoreTarget(nameof(Entities.Channel.RoomId))]
        [MapProperty(nameof(Entities.Channel.Id), nameof(ChannelDto.Id))]
        [MapProperty(nameof(Entities.Channel.ChannelAvatarUrl), nameof(ChannelDto.ChannelAvatarUrl))]
        public static partial Entities.Channel ToEntity(ChannelDto data);

        [MapperIgnoreSource(nameof(Entities.Channel.Id))]
        private static partial ChannelDto Map(Entities.Channel channel);

        //[MapProperty(nameof(ChannelUser.User.DisplayName), nameof(ChannelUserDto.UserName))]
        //[MapProperty(nameof(ChannelUser.User.AvatarUrl), nameof(ChannelUserDto.AvatarUrl))]
        [MapperIgnoreSource(nameof(ChannelUser.Role))]
        private static partial ChannelUserDto Map(ChannelUser source);

        public static Entities.Channel ChannelDtoToChannelCustom(ChannelDto data)
        {
            var dto = ToEntity(data);
            dto.Id = Guid.NewGuid();
            return dto;
        }

        public static ChannelDto ToHttp(Entities.Channel data)
        {
            var dto = Map(data);
            dto.Id = data.Id.ToString();
            return dto;
        }

        public static ChannelUserDto MapChannelUserToChannelUserDto(ChannelUser source)
        {
            var target = Map(source);
            target.Role = source.Role.ToString();
            //target.Status = source.User.Status.ToString();

            return target;
        }
    }
}

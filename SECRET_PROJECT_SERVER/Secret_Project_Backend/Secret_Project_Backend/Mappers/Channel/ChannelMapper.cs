using Riok.Mapperly.Abstractions;
using Secret_Project_Backend.DTOs;

namespace Secret_Project_Backend.Mappers.Channel
{
    [Mapper(EnumMappingStrategy = EnumMappingStrategy.ByName)]
    public static partial class ChannelMapper
    {
        [MapperIgnoreTarget(nameof(Models.Channel.ChannelUsers))]
        [MapperIgnoreTarget(nameof(Models.Channel.ChannelMessages))]
        [MapperIgnoreTarget(nameof(Models.Channel.Id))]
        private static partial Models.Channel ChannelDtoToChannel(ChannelDto data);

        public static Models.Channel ChannelDtoToChannelCustom(ChannelDto data)
        {
            var dto = ChannelDtoToChannel(data);
            dto.Id = Guid.NewGuid();
            return dto;
        }
    }
}

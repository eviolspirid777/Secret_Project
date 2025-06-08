using Riok.Mapperly.Abstractions;
using Secret_Project_Backend.DTOs;
using Secret_Project_Backend.DTOs.ChannelUser;
using Secret_Project_Backend.DTOs.User;
using Secret_Project_Backend.Models;

namespace Secret_Project_Backend.Mappers.Messages
{
    [Mapper]
    public static partial class ChannelMessagesMapper
    {
        private static partial Models.ChannelMessage ChannelMessageDtoToChannelMessage(ChannelMessageDto data);

        [MapProperty(nameof(ChannelUser.User.DisplayName), nameof(ChannelUserDto.UserName))]
        [MapProperty(nameof(ChannelUser.User.AvatarUrl), nameof(ChannelUserDto.AvatarUrl))]
        [MapperIgnoreSource(nameof(ChannelUser.Role))]
        private static partial ChannelUserDto Map(ChannelUser source);

        //TODO: Абстаркция над эти методом. Нужно еще посмотреть
        public static Models.ChannelMessage MapChannelMessageDtoToChannelMessage(ChannelMessageDto data)
        {
            var target = ChannelMessageDtoToChannelMessage(data);
            target.Sender = null;
            target.Channel = null;
            target.SentAt = new DateTime();
            return target;
        }

        public static ChannelUserDto MapChannelUserToChannelUserDto(ChannelUser source)
        {
            var target = Map(source);
            target.Role = source.Role.ToString();
            target.Status = source.User.Status.ToString();

            return target;
        }
    }
}

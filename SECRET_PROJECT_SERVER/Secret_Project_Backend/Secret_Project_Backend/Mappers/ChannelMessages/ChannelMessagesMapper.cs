using Riok.Mapperly.Abstractions;
using Secret_Project_Backend.DTOs;

namespace Secret_Project_Backend.Mappers.Messages
{
    [Mapper]
    public static partial class ChannelMessagesMapper
    {
        private static partial Models.ChannelMessage ChannelMessageDtoToChannelMessage(ChannelMessageDto data);

        //TODO: Абстаркция над эти методом. Нужно еще посмотреть
        public static Models.ChannelMessage MapChannelMessageDtoToChannelMessage(ChannelMessageDto data)
        {
            var target = ChannelMessageDtoToChannelMessage(data);
            target.Sender = null;
            target.Channel = null;
            target.SentAt = new DateTime();
            return target;
        }


    }
}

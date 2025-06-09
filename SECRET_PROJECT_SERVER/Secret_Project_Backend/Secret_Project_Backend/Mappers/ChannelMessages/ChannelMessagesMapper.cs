using Riok.Mapperly.Abstractions;
using Secret_Project_Backend.DTOs;
using Secret_Project_Backend.Models;

namespace Secret_Project_Backend.Mappers.Messages
{
    [Mapper]
    public static partial class ChannelMessagesMapper
    {
        [MapperIgnoreSource(nameof(ChannelMessageDto.Id))]
        [MapperIgnoreSource(nameof(ChannelMessageDto.SentAt))]
        private static partial ChannelMessage ChannelMessageDtoToChannelMessage(ChannelMessageDto data);

        [MapperIgnoreSource(nameof(ChannelMessage.ChannelFile))]
        private static partial ChannelMessageDto ChannelMessageToChannelMessageDtoPrivate(ChannelMessage data);

        //TODO: Абстаркция над эти методом. Нужно еще посмотреть
        public static ChannelMessage MapChannelMessageDtoToChannelMessage(ChannelMessageDto data)
        {
            var target = ChannelMessageDtoToChannelMessage(data);
            target.Sender = null;
            target.Channel = null;
            target.SentAt = new DateTime();
            return target;
        }

        public static ChannelMessageDto ChannelMessageToChannelMessageDto(ChannelMessage data)
        {
            var target = ChannelMessageToChannelMessageDtoPrivate(data);
            if(data.ChannelFile != null)
            {
                target.File = new DTOs.Channel.ChannelFileDto
                {
                    FileName = data.ChannelFile.FileName,
                    FileType = data.ChannelFile.FileType,
                    FileUrl = data.ChannelFile.FileUrl,
                    Id = data.ChannelFile.Id
                };
            }

            return target;
        }


    }
}

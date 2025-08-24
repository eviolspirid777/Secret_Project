using Amazon.Auth.AccessControlPolicy;
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
            if (data.RepliedChannelMessage != null)
            {
                target.RepliedMessage = new DTOs.RepliedMessage.RepliedMessageDTO();
                target.RepliedMessage.RepliedMessageId = data.RepliedChannelMessage.Id;
                target.RepliedMessage.SenderName = data.RepliedChannelMessage.Sender.DisplayName;
                target.RepliedMessage.Content = data.RepliedChannelMessage.Content;
                if (data.RepliedChannelMessage.ChannelFile != null)
                {
                    target.RepliedMessage.File = new DTOs.File.FileDto
                    {
                        Id = data.RepliedChannelMessage.ChannelFile.Id.ToString(),
                        FileName = data.RepliedChannelMessage.ChannelFile.FileName,
                        FileType = data.RepliedChannelMessage.ChannelFile.FileType,
                        FileUrl = data.RepliedChannelMessage.ChannelFile.FileUrl,
                    };
                }
            }
            if (data.Reactions != null)
            {
                target.Reactions = new List<DTOs.Reactions.ReactionDto>();
                foreach (var reaction in data.Reactions)
                {
                    target.Reactions.Add(new DTOs.Reactions.ReactionDto
                    {
                        Id = reaction.Id.ToString(),
                        Emotion = reaction.Emotion,
                        MessageId = reaction.MessageId,
                        ChannelMessageId = reaction.ChannelMessageId,
                        UserId = reaction.UserId,
                    });
                }
            }

            return target;
        }


    }
}

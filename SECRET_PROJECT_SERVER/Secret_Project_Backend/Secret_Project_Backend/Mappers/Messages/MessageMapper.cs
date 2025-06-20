using Riok.Mapperly.Abstractions;
using Secret_Project_Backend.DTOs.Messages;
using Secret_Project_Backend.Models;

namespace Secret_Project_Backend.Mappers.Messages
{
    [Mapper]
    public static partial class MessageMapper
    {
        [MapperIgnoreSource(nameof(Message.File))]
        [MapperIgnoreSource(nameof(MessageDto.RepliedMessage))]

        private static partial MessageDto Map(Message source);

        public static MessageDto MapMessageToMessageDto(Message source)
        {
            var target = Map(source);
            if(source.File != null)
            {
                target.File = new DTOs.File.FileDto()
                {
                    Id = source.File.Id.ToString(),
                    FileName = source.File.FileName,
                    FileType = source.File.FileType,
                    FileUrl = source.File.FileUrl,
                };
            }
            if(source.RepliedMessage != null)
            {
                target.RepliedMessage = new DTOs.RepliedMessage.RepliedMessageDTO();
                target.RepliedMessage.RepliedMessageId = source.RepliedMessage.Id;
                target.RepliedMessage.SenderName = source.RepliedMessage.Sender.DisplayName;
                target.RepliedMessage.Content = source.RepliedMessage.Content;
                if(source.RepliedMessage.File != null)
                {
                    target.RepliedMessage.File = new DTOs.File.FileDto
                    {
                        Id = source.RepliedMessage.File.Id.ToString(),
                        FileName = source.RepliedMessage.File.FileName,
                        FileType = source.RepliedMessage.File.FileType,
                        FileUrl = source.RepliedMessage.File.FileUrl,
                    };
                }
            }
            return target;
        }
    }
}

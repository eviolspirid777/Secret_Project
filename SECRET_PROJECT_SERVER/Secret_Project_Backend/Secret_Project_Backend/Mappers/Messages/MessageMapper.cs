using Riok.Mapperly.Abstractions;
using Secret_Project_Backend.DTOs.Messages;
using Secret_Project_Backend.Models;

namespace Secret_Project_Backend.Mappers.Messages
{
    [Mapper]
    public static partial class MessageMapper
    {
        [MapperIgnoreSource(nameof(Message.File))]
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
            return target;
        }
    }
}

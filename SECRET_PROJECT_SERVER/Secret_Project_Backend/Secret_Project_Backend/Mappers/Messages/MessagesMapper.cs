using Riok.Mapperly.Abstractions;
using Secret_Project_Backend.DTOs;

namespace Secret_Project_Backend.Mappers.Messages
{
    [Mapper]
    public static partial class MessagesMapper
    {
        public static partial Models.Message MessageDtoToMessage(MessageDto data);
    }
}

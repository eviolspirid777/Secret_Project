using Riok.Mapperly.Abstractions;
using Secret_Project_Backend.DTOs.Messages;
using Secret_Project_Backend.Models;

namespace Secret_Project_Backend.Mappers.Messages
{
    [Mapper]
    public static partial class MessageMapper
    {
        public static partial MessageDto MapMessageToMessageDto(Message source);
    }
}

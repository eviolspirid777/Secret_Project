using Riok.Mapperly.Abstractions;
using Secret_Project_Backend.DTOs;

namespace Secret_Project_Backend.Mappers.Messages
{
    [Mapper]
    public static partial class MessagesMapper
    {
        private static partial Models.Message MessageDtoToMessage(MessageDto data);

        //TODO: Абстаркция над эти методом. Нужно еще посмотреть
        public static Models.Message MapMessageDtoToMessage(MessageDto data)
        {
            var target = MessageDtoToMessage(data);
            target.Sender = null;
            target.Channel = null;
            target.SentAt = new DateTime();
            return target;
        }
    }
}

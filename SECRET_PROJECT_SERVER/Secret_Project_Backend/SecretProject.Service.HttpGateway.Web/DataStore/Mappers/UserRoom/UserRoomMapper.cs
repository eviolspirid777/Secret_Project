using Riok.Mapperly.Abstractions;
using Secret_Project_Backend.DTOs.UserRoom;

namespace Secret_Project_Backend.Mappers.UserRoom
{
    [Mapper]
    public static partial class UserRoomMapper
    {
        public static partial UserRoomDto MapUserRoomToUserRoomDto(Models.UserRoom source);
    }
}

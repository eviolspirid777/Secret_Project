using Riok.Mapperly.Abstractions;
using Secret_Project_Backend.DTOs.Room;


namespace Secret_Project_Backend.Mappers.Room
{
    [Mapper]
    public static partial class RoomMapper
    {
        public static partial RoomDto MapRoomToRoomDto(Models.Room source);
    }
}

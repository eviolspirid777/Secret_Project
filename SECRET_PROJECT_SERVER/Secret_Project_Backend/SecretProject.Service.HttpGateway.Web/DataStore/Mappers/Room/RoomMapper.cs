using Riok.Mapperly.Abstractions;
using SecretProject.Platform.Data.DTOs.Room;


namespace SecretProject.Service.HttpGateway.Web.DataStore.Mappers.Room;

[Mapper]
public static partial class RoomMapper
{
    public static partial RoomDto MapRoomToRoomDto(Models.Room source);
}

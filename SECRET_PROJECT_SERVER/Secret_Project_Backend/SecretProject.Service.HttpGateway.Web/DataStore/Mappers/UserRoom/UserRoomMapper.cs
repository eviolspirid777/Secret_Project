using Riok.Mapperly.Abstractions;
using SecretProject.Platform.Data.DataStore.DTOs.UserRoom;

namespace SecretProject.Service.HttpGateway.Web.DataStore.Mappers.UserRoom;

[Mapper]
public static partial class UserRoomMapper
{
    public static partial UserRoomDto MapUserRoomToUserRoomDto(Models.UserRoom source);
}

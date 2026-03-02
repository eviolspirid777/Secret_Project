using Riok.Mapperly.Abstractions;
using SecretProject.Platform.Data.DTOs.UserRoom;

namespace SecretProject.Service.HttpGateway.Web.DataStore.Mappers.UserRoom;

[Mapper]
public static partial class UserRoomMapper
{
    public static partial UserRoomDto MapUserRoomToUserRoomDto(Models.UserRoom source);
}

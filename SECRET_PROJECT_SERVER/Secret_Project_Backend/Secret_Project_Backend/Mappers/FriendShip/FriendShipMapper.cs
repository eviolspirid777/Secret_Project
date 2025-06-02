using Riok.Mapperly.Abstractions;
using Secret_Project_Backend.DTOs;
using Secret_Project_Backend.Models;

namespace Secret_Project_Backend.Mappers.FriendShip
{
    [Mapper]
    public static partial class FriendShipMapper
    {
        [MapperIgnoreSource(nameof(Friendship.Id))]
        public static partial FriendshipDto MapToFriendShipDto(Friendship sourse);
    }
}

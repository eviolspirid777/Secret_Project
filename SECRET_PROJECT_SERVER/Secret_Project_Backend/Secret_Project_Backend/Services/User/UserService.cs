using Microsoft.EntityFrameworkCore;
using Secret_Project_Backend.Context;
using Secret_Project_Backend.DTOs.User;
using Secret_Project_Backend.Mappers.FriendShip;
using Secret_Project_Backend.Models;

namespace Secret_Project_Backend.Services.User
{
    public class UserService
    {
        private readonly PostgreSQLDbContext _dbContext;
        public UserService(
            PostgreSQLDbContext dbContext    
        )
        {
            _dbContext = dbContext;
        }
        public async Task<List<UserDTO>> GetUserFriendsAsync(string id)
        {
            var isUserExist = await _dbContext
                .Users
                .AnyAsync(u => u.Id == id);
            if (isUserExist == false)
            {
                throw new Exception("Invalid userId");
            }

            var friendships = await _dbContext
                .Friendships
                .AsNoTracking()
                .Include(f => f.User)
                .Include(f => f.Friend)
                .Where(f => (f.UserId == id || f.FriendId == id) && f.Status == FriendshipStatus.Accepted)
                .ToListAsync();

            var mappedFriendships = friendships.Select(FriendShipMapper.MapFriendshipToFriendshipDto);
            // Преобразуем список дружб в список друзей
            //Собираем и из отправленных заявок и из полученных заявок
            var friends = mappedFriendships.Select(f =>
                f.User.UserId == id ? f.Friend : f.User
            ).ToList();

            return friends;
        }
    }
}

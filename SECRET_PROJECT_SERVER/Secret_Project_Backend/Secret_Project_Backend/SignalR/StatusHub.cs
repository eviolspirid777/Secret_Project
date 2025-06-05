using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Secret_Project_Backend.Context;
using Secret_Project_Backend.Models;
using Secret_Project_Backend.Services.Status;
using Secret_Project_Backend.Services.User;

namespace Secret_Project_Backend.SignalR
{
    [Authorize]
    public class StatusHub : Hub
    {
        private readonly PostgreSQLDbContext _dbContext;
        private readonly UserService _userService;
        public StatusHub(
            PostgreSQLDbContext dbContext,
            UserService userService
        )
        {
            _dbContext = dbContext;
            _userService = userService;
        }

        private async Task AlertFriendsOfStatusChangeAsync(ConnectionState state)
        {
            var email = Context.User?.Identity?.Name;
            var user = await _dbContext
                                        .Users
                                        .AsNoTracking()
                                        .FirstOrDefaultAsync(u => u.Email == email);
            if (user == null)
            {
                throw new Exception();
            }
            var userId = user.Id;

            var friends = await _userService.GetUserFriendsAsync(userId);
            foreach (var friend in friends)
            {
                await Clients.User(friend.UserId).SendAsync("friendStatusChange", userId, state.ToString());
            }
        }

        public async Task SendStatus(string userId, string friendId, string status)
        {
            await Clients.User(userId).SendAsync("friendStatusChange", friendId, status);
        }

        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            await AlertFriendsOfStatusChangeAsync(ConnectionState.Offline);
        }

        public override async Task OnConnectedAsync()
        {
            await AlertFriendsOfStatusChangeAsync(ConnectionState.Online);
        }
    }
}

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using System.Security.Claims;

namespace Secret_Project_Backend.SignalR
{
    public class FriendRequestHub : Hub
    {
        [Authorize]
        public async Task SendFriendRequestToUser(string userId, string friendId)
        {
            var userIdentifier = Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if(userIdentifier == null)
            {
                throw new HubException("Пользователь не авторизован");
            }
            await Clients.User(friendId).SendAsync("ReceiveFriendRequest", friendId);
        }
    }
}

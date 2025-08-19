using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using System.Security.Claims;
using static Secret_Project_Backend.Services.FriendshipSignalR.FriendshipSignalRServiceTypes;

namespace Secret_Project_Backend.SignalR
{
    [Authorize]
    public class FriendRequestHub : Hub
    {
        public async Task SendFriendRequestToUser(string userId, string friendId)
        {
            var userIdentifier = Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if(userIdentifier == null)
            {
                throw new HubException("Пользователь не авторизован");
            }
            await Clients.User(friendId).SendAsync("ReceiveFriendRequest", friendId);
        }

        public async Task SendFriendShipStatusChange(string userId, string friendId)
        {
            var data = new FriendshipStatusChangeData() { userId = userId, friendId = friendId };
            await Clients.Users([userId, friendId]).SendAsync("ReceiveFriendStatusChange", data);
        }
    }
}

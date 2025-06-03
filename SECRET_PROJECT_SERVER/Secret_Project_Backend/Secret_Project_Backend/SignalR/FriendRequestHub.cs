using Microsoft.AspNetCore.SignalR;

namespace Secret_Project_Backend.SignalR
{
    public class FriendRequestHub : Hub
    {
        public async Task SendFriendRequestToUser(string userId, string friendId)
        {
            await Clients.User(userId).SendAsync("ReceiveFriendRequest", friendId);
        }
    }
}

using System.Security.Claims;
using Microsoft.AspNetCore.SignalR;
using Secret_Project_Backend.SignalR;
using static Secret_Project_Backend.Services.FriendshipSignalR.FriendshipSignalRServiceTypes;

namespace Secret_Project_Backend.Services.FriendshipSignalR
{
    public class FriendshipSignalRService
    {

        private readonly IHubContext<FriendRequestHub> _friendshipSignalRServiceHub;
        public FriendshipSignalRService(
            IHubContext<FriendRequestHub> friendshipSignalRServiceHub
        )
        {
            _friendshipSignalRServiceHub = friendshipSignalRServiceHub;
        }

        public async Task SendFriendShipStatusChange(string userId, string friendId)
        {
            var data = new FriendshipStatusChangeData() { friendId = friendId, userId = userId };
            await _friendshipSignalRServiceHub.Clients.Users([userId, friendId]).SendAsync("ReceiveFriendStatusChange", data);
        }
    }
}

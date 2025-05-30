using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace Secret_Project_Backend.SignalR
{
    [Authorize]
    public class ChatHub : Hub
    {
        public async Task SendMessageToUser(string userId, string message)
        {
            await Clients.User(userId).SendAsync("ReceiveMessage", message);
        }
    }
}

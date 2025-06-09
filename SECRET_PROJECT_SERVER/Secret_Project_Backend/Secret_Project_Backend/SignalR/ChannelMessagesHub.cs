using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using Secret_Project_Backend.DTOs;

namespace Secret_Project_Backend.SignalR
{
    [Authorize]
    public class ChannelMessagesHub : Hub
    {
        public async Task SendMessageToChannelUserAsync(string userId, ChannelMessageDto message)
        {
            await Clients.User(userId).SendAsync("channelMessageRecived", message);
        }
    }
}

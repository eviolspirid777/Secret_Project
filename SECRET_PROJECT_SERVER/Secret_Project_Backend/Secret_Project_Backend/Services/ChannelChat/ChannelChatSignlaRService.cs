using Microsoft.AspNetCore.SignalR;
using Secret_Project_Backend.DTOs;
using Secret_Project_Backend.SignalR;

namespace Secret_Project_Backend.Services.ChannelChat
{
    public class ChannelChatSignlaRService
    {
        private readonly IHubContext<ChannelMessagesHub> _channelMessageHub;

        public ChannelChatSignlaRService(
            IHubContext<ChannelMessagesHub> channelMessageHub
        )
        {
            _channelMessageHub = channelMessageHub;
        }

        public async Task SendMessageToChannelUserAsync(string userId, ChannelMessageDto message)
        {
            await _channelMessageHub.Clients.User(userId).SendAsync("channelMessageRecived", message);
        }
    }
}

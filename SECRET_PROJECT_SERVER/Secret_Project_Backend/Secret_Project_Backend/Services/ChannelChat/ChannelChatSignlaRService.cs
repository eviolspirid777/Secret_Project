using Microsoft.AspNetCore.SignalR;
using Secret_Project_Backend.DTOs;
using Secret_Project_Backend.DTOs.Reactions;
using Secret_Project_Backend.DTOs.Room;
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

        public async Task SendRoomWasCreatedToUserAsync(string userId, RoomDto room)
        {
            await _channelMessageHub.Clients.User(userId).SendAsync("roomCreated", room);
        }

        public async Task SendRoomWasDeletedToUserAsync(string userId, Guid roomId)
        {
            await _channelMessageHub.Clients.User(userId).SendAsync("roomDeleted", roomId);
        }
        public async Task NotifyChannelUsersAboutReaction(string[] userIds, ReactionDto reaction)
        {
            await _channelMessageHub.Clients.Users(userIds).SendAsync("RecieveChannelReaction", reaction);
        }
    }
}

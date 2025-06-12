using Microsoft.AspNetCore.SignalR;
using Secret_Project_Backend.DTOs.Messages;
using Secret_Project_Backend.DTOs.Room;
using Secret_Project_Backend.DTOs.User;
using Secret_Project_Backend.DTOs.UserRoom;
using Secret_Project_Backend.Models;
using Secret_Project_Backend.SignalR;

namespace Secret_Project_Backend.Services.Chat
{
    public class MessageService
    {
        private readonly IHubContext<ChatHub> _userHub;
        public MessageService(
            IHubContext<ChatHub> userHub
        )
        {
            _userHub = userHub;
        }

        public async Task<bool> NotifyUserAsync(string userId, MessageDto message)
        {
            try
            {
                await _userHub.Clients.User(userId).SendAsync("ReceiveMessage", message);
                return true;
            } catch (Exception)
            {
                return false;
            }
        }

        public async Task<bool> NotifyUserAboutMessageDeleteAsync(string userId, Message message)
        {
            try
            {
                await _userHub.Clients.User(userId).SendAsync("DeleteMessage", message);
                return true;
            }
            catch (Exception)
            {
                return false;
            }
        }

        public async Task SendRoomWasCreatedToUserAsync(string userId, UserRoomDto room)
        {
            await _userHub.Clients.User(userId).SendAsync("roomCreated", room);
        }

        public async Task SendRoomWasDeletedToUserAsync(string userId, Guid roomId)
        {
            await _userHub.Clients.User(userId).SendAsync("roomDeleted", roomId);
        }
        public async Task SendCallingRequestToUserAsync(string userId, UserShortDto user)
        {
            await _userHub.Clients.User(userId).SendAsync("incommingCall", user);
        }

        public async Task AbortCallingRequestToUserAsync(string userId, UserShortDto user)
        {
            await _userHub.Clients.User(userId).SendAsync("abortIncommingCall", user);
        }
    }
}

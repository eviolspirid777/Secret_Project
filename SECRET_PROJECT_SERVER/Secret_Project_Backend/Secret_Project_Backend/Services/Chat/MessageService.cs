using Microsoft.AspNetCore.SignalR;
using Secret_Project_Backend.DTOs.Messages;
using Secret_Project_Backend.Models;
using Secret_Project_Backend.SignalR;

namespace Secret_Project_Backend.Services.Chat
{
    public class MessageService
    {
        private readonly IHubContext<ChatHub> _hubUserStatusContext;
        public MessageService(
            IHubContext<ChatHub> hubUserStatusContext
        )
        {
            _hubUserStatusContext = hubUserStatusContext;
        }

        public async Task<bool> NotifyUserAsync(string userId, MessageDto message)
        {
            try
            {
                await _hubUserStatusContext.Clients.User(userId).SendAsync("ReceiveMessage", message);
                return true;
            } catch (Exception)
            {
                return false;
            }
        }

        public async Task<bool> NotifyUserAboutMessageDeleteAsync(string userId, Guid messageId)
        {
            try
            {
                await _hubUserStatusContext.Clients.User(userId).SendAsync("DeleteMessage", messageId);
                return true;
            }
            catch (Exception)
            {
                return false;
            }
        }
    }
}

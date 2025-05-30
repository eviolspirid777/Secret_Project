using System.Security.Claims;
using Microsoft.AspNetCore.SignalR;

namespace Secret_Project_Backend.Services.Chat
{
    public class NameUserIdProvider : IUserIdProvider
    {
        public string GetUserId(HubConnectionContext connection)
        {
            var userId = connection.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            return userId;
        }
    }
}

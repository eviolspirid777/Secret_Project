using System.Threading.Tasks;

namespace Secret_Project_Backend.Services
{
    public interface IEmailService
    {
        Task SendEmailAsync(string email, string subject, string message);
        Task SendEmailConfirmationAsync(string email, string userId, string token);
    }
} 
namespace SecretProject.Service.Email.DataStore.Abstractions
{
    public interface IEmailService
    {
        Task SendEmailAsync(string email, string subject, string message);
        Task SendEmailConfirmationAsync(string email, string userId, string token);
    }
}

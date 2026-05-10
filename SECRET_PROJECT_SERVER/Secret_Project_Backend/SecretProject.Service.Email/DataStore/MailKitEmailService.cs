using MailKit.Security;
using Microsoft.Extensions.Options;
using MimeKit;
using SecretProject.Distribution.Data.Messages.Factories;
using SecretProject.Service.Email.Configuration;
using SecretProject.Service.Email.DataStore.Abstractions;

namespace SecretProject.Service.Email.DataStore
{
    public class MailKitEmailService : IEmailService
    {
        private readonly ILogger<MailKitEmailService> _logger;
        private readonly IMessageFactory _messageFactory;
        private readonly EmailOptions _emailOptions;

        public MailKitEmailService(
            ILogger<MailKitEmailService> logger,
            IOptions<EmailOptions> emailOptions,
            IMessageFactory messageFactory)
        {
            _messageFactory = messageFactory;
            _logger = logger;
            _emailOptions = emailOptions.Value;
        }

        public async Task SendEmailAsync(string email, string subject, string message)
        {
            var emailMessage = new MimeMessage();
            emailMessage.From.Add(new MailboxAddress(_emailOptions.FromName, _emailOptions.FromEmail));
            emailMessage.To.Add(new MailboxAddress("", email));
            emailMessage.Subject = subject;

            var bodyBuilder = new BodyBuilder
            {
                HtmlBody = message
            };

            emailMessage.Body = bodyBuilder.ToMessageBody();

            using var client = new MailKit.Net.Smtp.SmtpClient();
            try
            {
                client.CheckCertificateRevocation = false;
                await client.ConnectAsync(_emailOptions.SmtpServer, _emailOptions.SmtpPort, SecureSocketOptions.StartTls);
                await client.AuthenticateAsync(_emailOptions.SmtpUsername, _emailOptions.SmtpPassword);
                await client.SendAsync(emailMessage);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Ошибка при отправке сообщения на почту");
            }
            finally
            {
                await client.DisconnectAsync(true);
            }
        }

        public async Task SendEmailConfirmationAsync(string email, string userId, string token)
        {
            var message = _messageFactory.CreateEmailConfirmationMessage(_emailOptions.ApplicationUrl, userId, token);

            await SendEmailAsync(email, message.Subject, message.Text);
            _logger.LogInformation("Отправлено сообщение с подтверждением на почту {email} пользователю {user}", email, userId);
        }
    }
}

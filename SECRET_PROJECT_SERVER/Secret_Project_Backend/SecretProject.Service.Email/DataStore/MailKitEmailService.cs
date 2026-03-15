using MimeKit;
using MailKit.Security;
using SecretProject.Distribution.Data.Messages.Factories;
using SecretProject.Service.Email.DataStore.Abstractions;

namespace SecretProject.Service.Email.DataStore
{
    public class MailKitEmailService : IEmailService
    {
        private readonly ILogger<MailKitEmailService> _logger;
        private readonly IConfiguration _configuration;
        private readonly IMessageFactory _messageFactory;
        private readonly string _smtpServer;
        private readonly int _smtpPort;
        private readonly string _smtpUsername;
        private readonly string _smtpPassword;
        private readonly string _fromEmail;
        private readonly string _fromName;

        public MailKitEmailService(ILogger<MailKitEmailService> logger, IConfiguration configuration, IMessageFactory messageFactory)
        {
            _configuration = configuration;
            _messageFactory = messageFactory;
            _logger = logger;

            _smtpServer = _configuration["Email:SmtpServer"];
            _smtpPort = int.Parse(_configuration["Email:SmtpPort"]);
            _smtpUsername = _configuration["Email:SmtpUsername"];
            _smtpPassword = _configuration["Email:SmtpPassword"];
            _fromEmail = _configuration["Email:FromEmail"];
            _fromName = _configuration["Email:FromName"];
        }

        public async Task SendEmailAsync(string email, string subject, string message)
        {
            var emailMessage = new MimeMessage();
            emailMessage.From.Add(new MailboxAddress(_fromName, _fromEmail));
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
                await client.ConnectAsync(_smtpServer, _smtpPort, SecureSocketOptions.StartTls);
                await client.AuthenticateAsync(_smtpUsername, _smtpPassword);
                await client.SendAsync(emailMessage);
            }
            catch(Exception ex)
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
            var message = _messageFactory.CreateEmailConfirmationMessage(_configuration, userId, token);

            await SendEmailAsync(email, message.Subject, message.Text);
            _logger.LogInformation("Отправлено сообщение с подтверждением на почту {email} пользователю {user}", email, userId);
        }
    }
}

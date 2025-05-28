using System;
using System.Threading.Tasks;
using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.Extensions.Configuration;
using MimeKit;

namespace Secret_Project_Backend.Services
{
    public class MailKitEmailService : IEmailService
    {
        private readonly IConfiguration _configuration;
        private readonly string _smtpServer;
        private readonly int _smtpPort;
        private readonly string _smtpUsername;
        private readonly string _smtpPassword;
        private readonly string _fromEmail;
        private readonly string _fromName;

        public MailKitEmailService(IConfiguration configuration)
        {
            _configuration = configuration;
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

            using var client = new SmtpClient();
            try
            {
                await client.ConnectAsync(_smtpServer, _smtpPort, SecureSocketOptions.StartTls);
                await client.AuthenticateAsync(_smtpUsername, _smtpPassword);
                await client.SendAsync(emailMessage);
            }
            finally
            {
                await client.DisconnectAsync(true);
            }
        }

        public async Task SendEmailConfirmationAsync(string email, string userId, string token)
        {
            var confirmationLink = $"{_configuration["ApplicationUrl"]}/Auth/confirm-email?UserId={userId}&Token={Uri.EscapeDataString(token)}";
            var subject = "Подтверждение email адреса";
            var message = $@"
                <div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;'>
                    <h2 style='color: #333;'>Подтверждение регистрации</h2>
                    <p style='color: #666;'>Спасибо за регистрацию! Для подтверждения вашего email адреса, пожалуйста, перейдите по ссылке ниже:</p>
                    <p style='margin: 20px 0;'>
                        <a href='{confirmationLink}' 
                           style='background-color: #4CAF50; 
                                  color: white; 
                                  padding: 10px 20px; 
                                  text-decoration: none; 
                                  border-radius: 5px; 
                                  display: inline-block;'>
                            Подтвердить email
                        </a>
                    </p>
                    <p style='color: #666;'>Если вы не регистрировались на нашем сайте, просто проигнорируйте это письмо.</p>
                    <hr style='border: 1px solid #eee; margin: 20px 0;'>
                    <p style='color: #999; font-size: 12px;'>Это письмо отправлено автоматически, пожалуйста, не отвечайте на него.</p>
                </div>";

            await SendEmailAsync(email, subject, message);
        }
    }
} 
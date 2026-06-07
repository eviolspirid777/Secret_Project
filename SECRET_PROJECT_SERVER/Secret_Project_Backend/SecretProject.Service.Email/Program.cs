using Microsoft.EntityFrameworkCore;
using SecretProject.Distribution.Data.Constructors.Links;
using SecretProject.Distribution.Data.Constructors.Messages;
using SecretProject.Distribution.Data.DataStore.Context;
using SecretProject.Distribution.Data.Messages.Factories;
using SecretProject.Infrastructure.Messaging.Abstractions;
using SecretProject.Infrastructure.Messaging.Events.Auth;
using SecretProject.Infrastructure.Messaging.Events.Email;
using SecretProject.Infrastructure.Messaging.Extension;
using SecretProject.Service.Email.Configuration;
using SecretProject.Service.Email.DataStore;
using SecretProject.Service.Email.DataStore.Abstractions;
using SecretProject.Service.Email.Infrastructure.Messaging;
using SecretProject.Service.Email.Services.gRPC;

namespace SecretProject.Service.Email
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            var postgresOptions = builder.Configuration
                .GetRequiredSection(PostgreSqlOptions.SectionName)
                .Get<PostgreSqlOptions>() ?? throw new InvalidOperationException("ConnectionStrings section is required.");

            builder.Services.AddOptions<EmailOptions>()
                .Bind(builder.Configuration.GetRequiredSection(EmailOptions.SectionName))
                .Validate(options => !string.IsNullOrWhiteSpace(options.SmtpServer), "Email:SmtpServer is required.")
                .Validate(options => options.SmtpPort > 0, "Email:SmtpPort must be greater than 0.")
                .Validate(options => !string.IsNullOrWhiteSpace(options.SmtpUsername), "Email:SmtpUsername is required.")
                .Validate(options => !string.IsNullOrWhiteSpace(options.SmtpPassword), "Email:SmtpPassword is required.")
                .Validate(options => !string.IsNullOrWhiteSpace(options.FromEmail), "Email:FromEmail is required.")
                .Validate(options => !string.IsNullOrWhiteSpace(options.FromName), "Email:FromName is required.")
                .Validate(options => !string.IsNullOrWhiteSpace(options.ApplicationUrl), "Email:ApplicationUrl is required.")
                .ValidateOnStart();

            builder.Services.AddDbContext<DistributionDbContext>(options =>
            {
                options.UseNpgsql(
                    postgresOptions.PostgreSQL,
                    npgsql => npgsql.MigrationsHistoryTable("__EFMigrationsHistory", "distribution"));
            });

            builder.Services.AddRabbitMqMessaging(builder.Configuration);
            builder.Services.AddRabbitMqConsumer("secretproject.email.events", consumer =>
            {
                consumer.Subscribe<EmailConfirmationRequestedEvent>(AuthenticationEventTypes.EmailConfirmationRequested);
            }, maxRetryAttempts: 3, retryDelaySeconds: 30);
            builder.Services.AddScoped<IIntegrationEventHandler<EmailConfirmationRequestedEvent>, EmailConfirmationRequestedHandler>();

            builder.Services.AddGrpc();
            builder.Services.AddControllers();
            builder.Services.AddScoped<IEmailMessageConstructor, EmailMessageConstructor>();
            builder.Services.AddScoped<ILinkConstructor, LinkConstructor>();
            builder.Services.AddScoped<IMessageFactory, MessageFactory>();
            builder.Services.AddScoped<IEmailService, MailKitEmailService>();
            builder.Services.AddOpenApi();

            var app = builder.Build();

            app.MapGrpcService<EmailServiceImpl>();
            if (app.Environment.IsDevelopment())
            {
                app.MapOpenApi();
            }

            app.UseHttpsRedirection();
            app.UseAuthorization();
            app.MapControllers();

            app.Run();
        }
    }
}


using SecretProject.Distribution.Data.Constructors.Links;
using SecretProject.Distribution.Data.Constructors.Messages;
using SecretProject.Distribution.Data.Messages.Factories;
using SecretProject.Service.Email.DataStore;
using SecretProject.Service.Email.DataStore.Abstractions;
using SecretProject.Service.Email.Services.gRPC;

namespace SecretProject.Service.Email
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.
            builder.Services.AddGrpc();
            builder.Services.AddControllers();
            builder.Services.AddScoped<IEmailMessageConstructor, EmailMessageConstructor>();
            builder.Services.AddScoped<ILinkConstructor, LinkConstructor>();
            builder.Services.AddScoped<IMessageFactory, MessageFactory>();
            builder.Services.AddScoped<IEmailService, MailKitEmailService>();
            // Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
            builder.Services.AddOpenApi();

            var app = builder.Build();

            app.MapGrpcService<EmailServiceImpl>();
            // Configure the HTTP request pipeline.
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

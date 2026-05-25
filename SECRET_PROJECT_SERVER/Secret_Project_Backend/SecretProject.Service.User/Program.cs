using Microsoft.EntityFrameworkCore;
using SecretProject.Service.User.Configuration;
using SecretProject.Service.User.ProgramServicesExtensions.GrpcClients;
using SecretProject.Service.User.Services.gRPC;
using SecretProject.User.Data.DataStore.Context;
using SecretProject.Infrastructure.Messaging.Extension;


namespace SecretProject.Service.User;

public class Program
{
    public static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);
        var jwtOptions = builder.Configuration
            .GetRequiredSection(JwtOptions.SectionName)
            .Get<JwtOptions>() ?? throw new InvalidOperationException("Jwt section is required.");
        var postgresOptions = builder.Configuration
                .GetRequiredSection(PostgreSqlOptions.SectionName)
                .Get<PostgreSqlOptions>() ?? throw new InvalidOperationException("ConnectionStrings section is required.");
        var serviceEndpoints = builder.Configuration
               .GetRequiredSection(ServiceEndpointsOptions.SectionName)
               .Get<ServiceEndpointsOptions>() ?? throw new InvalidOperationException("Services section is required.");

        builder.Services.AddGrpc();
        builder.Services.AddOptions<PostgreSqlOptions>()
                .Bind(builder.Configuration.GetRequiredSection(PostgreSqlOptions.SectionName))
                .Validate(options => !string.IsNullOrWhiteSpace(options.PostgreSQL), "ConnectionStrings:PostgreSQL is required.")
                .ValidateOnStart();
        builder.Services.AddOptions<JwtOptions>()
                .Bind(builder.Configuration.GetRequiredSection(JwtOptions.SectionName))
                .Validate(options => !string.IsNullOrWhiteSpace(options.Key), "Jwt:Key is required.")
                .Validate(options => !string.IsNullOrWhiteSpace(options.Issuer), "Jwt:Issuer is required.")
                .Validate(options => !string.IsNullOrWhiteSpace(options.Audience), "Jwt:Audience is required.")
                .ValidateOnStart();

        builder.Services.AddRabbitMqMessaging(builder.Configuration);

        builder.Services.AddDbContext<UserDbContext>(options =>
        {
            options.UseNpgsql(
                postgresOptions.PostgreSQL,
                npgsql => npgsql.MigrationsHistoryTable("__EFMigrationsHistory", "user"));
        });

        builder.Services.AddGrpcClients(serviceEndpoints, builder.Environment);

        var app = builder.Build();

        app.UseHttpsRedirection();
        app.UseRouting();
        app.MapGrpcService<UserServiceImpl>();
        app.MapGet("/health", () => "User Service is running").AllowAnonymous();

        app.Run();
    }
}

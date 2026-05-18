using Microsoft.EntityFrameworkCore;
using SecretProject.Service.User.Configuration;
using SecretProject.Service.User.ProgramServicesExtensions.GrpcClients;
using SecretProject.Service.User.Services.gRPC;
using SecretProject.User.Data.DataStore.Context;


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
        builder.Services.AddOptions<RabbitMqOptions>()
                .Bind(builder.Configuration.GetRequiredSection(RabbitMqOptions.SectionName))
                .Validate(o => !string.IsNullOrWhiteSpace(o.Host), "RabbitMq:Host is required.")
                .Validate(o => !string.IsNullOrWhiteSpace(o.Username), "RabbitMq:Username is required.")
                .Validate(o => !string.IsNullOrWhiteSpace(o.Password), "RabbitMq:Password is required.")
                .ValidateOnStart();
        //builder.Services.AddOptions<ServiceEndpointsOptions>()
        //    .Bind(builder.Configuration.GetRequiredSection(ServiceEndpointsOptions.SectionName))
        //    .Validate(options => !string.IsNullOrWhiteSpace(options.EmailService), "Services:EmailService is required.")
        //    .ValidateOnStart();


        builder.Services.AddDbContext<UserDbContext>(options =>
        {
            options.UseNpgsql(
                postgresOptions.PostgreSQL,
                npgsql => npgsql.MigrationsHistoryTable("__EFMigrationsHistory", "user"));
        });

        builder.Services.AddProjectGrpcClients(serviceEndpoints, builder.Environment);

        var app = builder.Build();

        app.UseHttpsRedirection();
        app.UseRouting();
        app.MapGrpcService<UserServiceImpl>();
        app.MapGet("/health", () => "User Service is running").AllowAnonymous();

        app.Run();
    }
}

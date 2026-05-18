using Microsoft.EntityFrameworkCore;
using SecretProject.Channels.Data.DataStore.Context;
using SecretProject.Service.Channels.Configuration;
using SecretProject.Service.Channels.Services.gRPC;
using SecretProject.Service.Grpc.v1.Proto;

namespace SecretProject.Service.Channels
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);
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
            builder.Services.AddOptions<ServiceEndpointsOptions>()
                .Bind(builder.Configuration.GetRequiredSection(ServiceEndpointsOptions.SectionName))
                .Validate(options => !string.IsNullOrWhiteSpace(options.AuthService), "Services:AuthService is required.")
                .ValidateOnStart();
            builder.Services.AddDbContext<ChannelDbContext>(options =>
            {
                options.UseNpgsql(
                    postgresOptions.PostgreSQL,
                    npgsql => npgsql.MigrationsHistoryTable("__EFMigrationsHistory", "channel"));
            });
            builder.Services.AddProjectGrpcClients(serviceEndpoints, builder.Environment);

            var app = builder.Build();

            app.UseHttpsRedirection();  
            app.UseRouting();
            app.MapGrpcService<ChannelServiceImpl>();
            app.MapGet("/health", () => "Channels Service is running").AllowAnonymous();

            app.Run();
        }
    }
}

using Microsoft.EntityFrameworkCore;
using SecretProject.Channels.Data.DataStore.Context;
using SecretProject.Service.Channels.Services.gRPC;
using SecretProject.Service.Grpc.v1.Proto;

namespace SecretProject.Service.Channels
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            builder.Services.AddGrpc();
            builder.Services.AddDbContext<ChannelDbContext>(options =>
            {
                options.UseNpgsql(
                    builder.Configuration.GetConnectionString("PostgreSQL"),
                    npgsql => npgsql.MigrationsHistoryTable("__EFMigrationsHistory", "channel"));
            });

            builder.Services.AddGrpcClient<AuthService.AuthServiceClient>(options =>
            {
                options.Address = new Uri(builder.Configuration["Services:AuthService"] ?? "https://localhost:7045");
            })
            .ConfigurePrimaryHttpMessageHandler(() =>
            {
                var handler = new HttpClientHandler();
                if (builder.Environment.IsDevelopment())
                {
                    handler.ServerCertificateCustomValidationCallback =
                        HttpClientHandler.DangerousAcceptAnyServerCertificateValidator;
                }

                return handler;
            });

            var app = builder.Build();

            app.UseHttpsRedirection();
            app.UseRouting();
            app.MapGrpcService<ChannelServiceImpl>();
            app.MapGet("/health", () => "Channels Service is running").AllowAnonymous();

            app.Run();
        }
    }
}

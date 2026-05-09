using Grpc.Core;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using SecretProject.Service.Grpc.v1.Proto;

public static class GrpcExtensions
{
    public static IServiceCollection AddProjectGrpcClients(
        this IServiceCollection services,
        IConfiguration configuration,
        IHostEnvironment environment)
    {
        AddClient<AuthService.AuthServiceClient>(
            services,
            configuration["Services:AuthService"],
            environment);

        AddClient<ChannelService.ChannelServiceClient>(
            services,
            configuration["Services:ChannelService"],
            environment);

        return services;
    }

    private static void AddClient<TClient>(
        IServiceCollection services,
        string? address,
        IHostEnvironment environment)
        where TClient : ClientBase<TClient>
    {
        if (string.IsNullOrWhiteSpace(address))
            throw new InvalidOperationException($"Address for {typeof(TClient).Name} is not configured.");

        services
            .AddGrpcClient<TClient>(options =>
            {
                options.Address = new Uri(address);
            })
            .ConfigurePrimaryHttpMessageHandler(() =>
            {
                var handler = new HttpClientHandler();

                if (environment.IsDevelopment())
                {
                    handler.ServerCertificateCustomValidationCallback =
                        HttpClientHandler.DangerousAcceptAnyServerCertificateValidator;
                }

                return handler;
            });
    }
}

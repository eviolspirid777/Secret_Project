using Grpc.Core;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using SecretProject.Service.Grpc.v1.Proto;
using SecretProject.Service.HttpGateway.Web.Configuration;

public static class GrpcExtensions
{
    public static IServiceCollection AddProjectGrpcClients(
        this IServiceCollection services,
        ServiceEndpointsOptions serviceEndpoints,
        IHostEnvironment environment)
    {
        AddClient<AuthService.AuthServiceClient>(
            services,
            serviceEndpoints.AuthService,
            environment);

        AddClient<ChannelService.ChannelServiceClient>(
            services,
            serviceEndpoints.ChannelService,
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

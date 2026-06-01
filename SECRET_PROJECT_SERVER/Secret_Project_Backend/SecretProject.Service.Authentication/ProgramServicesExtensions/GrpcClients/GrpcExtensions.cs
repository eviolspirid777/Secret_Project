using Grpc.Core;
using SecretProject.Data.Contracts.Email;
using SecretProject.Service.Authentication.Configuration;


namespace SecretProject.Service.Authentication.ProgramServicesExtensions;

public static class GrpcExtensions
{
    public static IServiceCollection AddProjectGrpcClients(
        this IServiceCollection services,
        ServiceEndpointsOptions serviceEndpoints,
        IHostEnvironment environment)
    {
        AddClient<EmailService.EmailServiceClient>(
            services,
            serviceEndpoints.EmailService,
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

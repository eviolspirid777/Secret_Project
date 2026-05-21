using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using SecretProject.Infrastructure.Messaging.Abstractions;
using SecretProject.Infrastructure.Messaging.RabbitMQ;

namespace SecretProject.Infrastructure.Messaging.Extension
{
    public static class ServiceCollectionExtensions
    {
        public static IServiceCollection AddRabbitMqMessaging(
            this IServiceCollection services,
            IConfiguration configuration)
        {
            services.AddOptions<RabbitMqOptions>()
                .Bind(configuration.GetRequiredSection(RabbitMqOptions.SectionName))
                .Validate(o => !string.IsNullOrWhiteSpace(o.Host), "RabbitMq:Host is required.")
                .Validate(o => !string.IsNullOrWhiteSpace(o.Username), "RabbitMq:Username is required.")
                .Validate(o => !string.IsNullOrWhiteSpace(o.Password), "RabbitMq:Password is required.")
                .ValidateOnStart();

            services.AddSingleton<IEventPublisher, RabbitMqEventPublisher>();

            return services;
        }
    }

}

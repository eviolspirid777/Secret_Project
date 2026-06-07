namespace SecretProject.Infrastructure.Messaging.RabbitMQ
{
    public sealed class RabbitMqOptions
    {
        public const string SectionName = "RabbitMq";

        public string Host { get; init; } = string.Empty;
        public int Port { get; init; } = 5672;
        public string Username { get; init; } = string.Empty;
        public string Password { get; init; } = string.Empty;
        public string VirtualHost { get; init; } = "/";
        public string Exchange { get; init; } = "secretproject.events";
        public string RetryExchange { get; init; } = "secretproject.events.retry";
        public string DeadLetterExchange { get; init; } = "secretproject.events.dead";
    }
}

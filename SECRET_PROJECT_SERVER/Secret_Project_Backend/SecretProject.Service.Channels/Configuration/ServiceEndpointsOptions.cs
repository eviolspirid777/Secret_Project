namespace SecretProject.Service.Channels.Configuration;

public sealed class ServiceEndpointsOptions
{
    public const string SectionName = "Services";

    public string AuthService { get; init; } = string.Empty;
}

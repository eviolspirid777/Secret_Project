namespace SecretProject.Service.Authentication.Configuration;

public sealed class ServiceEndpointsOptions
{
    public const string SectionName = "Services";

    public string EmailService { get; init; } = string.Empty;
}

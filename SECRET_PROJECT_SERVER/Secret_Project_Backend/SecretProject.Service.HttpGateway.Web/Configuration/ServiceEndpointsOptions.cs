namespace SecretProject.Service.HttpGateway.Web.Configuration;

public sealed class ServiceEndpointsOptions
{
    public const string SectionName = "Services";

    public string AuthService { get; init; } = string.Empty;
    public string ChannelService { get; init; } = string.Empty;
}

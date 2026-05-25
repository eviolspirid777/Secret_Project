namespace SecretProject.Service.User.Configuration;

public sealed class JwtOptions
{
    public const string SectionName = "Jwt";

    public string Key { get; init; } = string.Empty;
    public string Issuer { get; init; } = string.Empty;
    public string Audience { get; init; } = string.Empty;
}

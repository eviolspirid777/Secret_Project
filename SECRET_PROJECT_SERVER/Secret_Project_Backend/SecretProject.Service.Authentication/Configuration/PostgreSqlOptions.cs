namespace SecretProject.Service.Authentication.Configuration;

public sealed class PostgreSqlOptions
{
    public const string SectionName = "ConnectionStrings";

    public string PostgreSQL { get; init; } = string.Empty;
}

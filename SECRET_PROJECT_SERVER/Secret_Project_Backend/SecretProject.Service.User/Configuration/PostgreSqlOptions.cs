namespace SecretProject.Service.User.Configuration;

public sealed class PostgreSqlOptions
{
    public const string SectionName = "ConnectionStrings";

    public string PostgreSQL { get; init; } = string.Empty;
}

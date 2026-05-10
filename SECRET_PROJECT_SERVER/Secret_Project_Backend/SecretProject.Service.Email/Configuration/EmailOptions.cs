namespace SecretProject.Service.Email.Configuration;

public sealed class EmailOptions
{
    public const string SectionName = "Email";

    public string SmtpServer { get; init; } = string.Empty;
    public int SmtpPort { get; init; }
    public string SmtpUsername { get; init; } = string.Empty;
    public string SmtpPassword { get; init; } = string.Empty;
    public string FromEmail { get; init; } = string.Empty;
    public string FromName { get; init; } = string.Empty;
    public string ApplicationUrl { get; init; } = string.Empty;
}

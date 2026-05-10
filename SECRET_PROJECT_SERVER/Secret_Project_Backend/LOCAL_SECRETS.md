# Local Secrets

This solution keeps local secrets in `.NET user-secrets` instead of `appsettings.json`.

## Services with local secrets

- `SecretProject.Service.Authentication`
  - `ConnectionStrings:PostgreSQL`
  - `Jwt:Key`
- `SecretProject.Service.Channels`
  - `ConnectionStrings:PostgreSQL`
- `SecretProject.Service.HttpGateway.Web`
  - `Jwt:Key`
- `SecretProject.Service.Email`
  - `Email:SmtpServer`
  - `Email:SmtpPort`
  - `Email:SmtpUsername`
  - `Email:SmtpPassword`
  - `Email:FromEmail`
  - `Email:FromName`
  - `Email:ApplicationUrl`

## Example commands

```powershell
dotnet user-secrets set "ConnectionStrings:PostgreSQL" "<postgres-connection-string>" --project ".\SecretProject.Service.Authentication\SecretProject.Service.Authentication.csproj"
dotnet user-secrets set "Jwt:Key" "<jwt-signing-key>" --project ".\SecretProject.Service.Authentication\SecretProject.Service.Authentication.csproj"

dotnet user-secrets set "ConnectionStrings:PostgreSQL" "<postgres-connection-string>" --project ".\SecretProject.Service.Channels\SecretProject.Service.Channels.csproj"

dotnet user-secrets set "Jwt:Key" "<jwt-signing-key>" --project ".\SecretProject.Service.HttpGateway.Web\SecretProject.Service.HttpGateway.Web.csproj"

dotnet user-secrets set "Email:SmtpServer" "<smtp-host>" --project ".\SecretProject.Service.Email\SecretProject.Service.Email.csproj"
dotnet user-secrets set "Email:SmtpPort" "587" --project ".\SecretProject.Service.Email\SecretProject.Service.Email.csproj"
dotnet user-secrets set "Email:SmtpUsername" "<smtp-login>" --project ".\SecretProject.Service.Email\SecretProject.Service.Email.csproj"
dotnet user-secrets set "Email:SmtpPassword" "<smtp-password>" --project ".\SecretProject.Service.Email\SecretProject.Service.Email.csproj"
dotnet user-secrets set "Email:FromEmail" "<from-email>" --project ".\SecretProject.Service.Email\SecretProject.Service.Email.csproj"
dotnet user-secrets set "Email:FromName" "SecretProject" --project ".\SecretProject.Service.Email\SecretProject.Service.Email.csproj"
dotnet user-secrets set "Email:ApplicationUrl" "https://localhost:7215" --project ".\SecretProject.Service.Email\SecretProject.Service.Email.csproj"
```

## Rule of thumb

- Non-secret defaults may stay in `appsettings.json`.
- Passwords, tokens, signing keys, and connection strings with credentials must stay out of git.
- New external dependencies such as RabbitMQ, Elasticsearch, Redis, or S3 should get:
  - a typed options class
  - validation on startup
  - local values in `dotnet user-secrets`

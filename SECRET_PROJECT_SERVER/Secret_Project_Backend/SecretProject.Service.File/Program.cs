
using SecretProject.Service.File.Configuration;

namespace SecretProject.Service.File
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            var jwtOptions = builder.Configuration
            .GetRequiredSection(JwtOptions.SectionName)
            .Get<JwtOptions>() ?? throw new InvalidOperationException("Jwt section is required.");
            var postgresOptions = builder.Configuration
                    .GetRequiredSection(PostgreSqlOptions.SectionName)
                    .Get<PostgreSqlOptions>() ?? throw new InvalidOperationException("ConnectionStrings section is required.");

            builder.Services.AddOptions<PostgreSqlOptions>()
                .Bind(builder.Configuration.GetRequiredSection(PostgreSqlOptions.SectionName))
                .Validate(options => !string.IsNullOrWhiteSpace(options.PostgreSQL), "ConnectionStrings:PostgreSQL is required.")
                .ValidateOnStart();
            builder.Services.AddOptions<JwtOptions>()
                    .Bind(builder.Configuration.GetRequiredSection(JwtOptions.SectionName))
                    .Validate(options => !string.IsNullOrWhiteSpace(options.Key), "Jwt:Key is required.")
                    .Validate(options => !string.IsNullOrWhiteSpace(options.Issuer), "Jwt:Issuer is required.")
                    .Validate(options => !string.IsNullOrWhiteSpace(options.Audience), "Jwt:Audience is required.")
                    .ValidateOnStart();

            var app = builder.Build();
            app.UseHttpsRedirection();
            app.UseAuthorization();
            app.MapControllers();
            app.Run();
        }
    }
}

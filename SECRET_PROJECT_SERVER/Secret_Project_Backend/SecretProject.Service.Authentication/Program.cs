using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using SecretProject.Authentication.Data.DataStore.Context;
using SecretProject.Authentication.Data.DataStore.Entities;
using SecretProject.Service.Authentication.Configuration;
using SecretProject.Service.Authentication.Infrastructure.Messaging;
using SecretProject.Service.Authentication.Services.gRPC;
using SecretProject.Service.Grpc.v1.Proto;
using System.Text;

namespace SecretProject.Service.Authentication
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);
            var postgresOptions = builder.Configuration
                .GetRequiredSection(PostgreSqlOptions.SectionName)
                .Get<PostgreSqlOptions>() ?? throw new InvalidOperationException("ConnectionStrings section is required.");
            var jwtOptions = builder.Configuration
                .GetRequiredSection(JwtOptions.SectionName)
                .Get<JwtOptions>() ?? throw new InvalidOperationException("Jwt section is required.");
            var serviceEndpoints = builder.Configuration
                .GetRequiredSection(ServiceEndpointsOptions.SectionName)
                .Get<ServiceEndpointsOptions>() ?? throw new InvalidOperationException("Services section is required.");

            builder.Services.AddGrpc();
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
            builder.Services.AddOptions<ServiceEndpointsOptions>()
                .Bind(builder.Configuration.GetRequiredSection(ServiceEndpointsOptions.SectionName))
                .Validate(options => !string.IsNullOrWhiteSpace(options.EmailService), "Services:EmailService is required.")
                .ValidateOnStart();
            builder.Services.AddOptions<RabbitMqOptions>()
                .Bind(builder.Configuration.GetRequiredSection(RabbitMqOptions.SectionName))
                .Validate(o => !string.IsNullOrWhiteSpace(o.Host), "RabbitMq:Host is required.")
                .Validate(o => !string.IsNullOrWhiteSpace(o.Username), "RabbitMq:Username is required.")
                .Validate(o => !string.IsNullOrWhiteSpace(o.Password), "RabbitMq:Password is required.")
                .ValidateOnStart();

            builder.Services.AddDbContext<AuthDbContext>(options =>
            {
                options.UseNpgsql(
                    postgresOptions.PostgreSQL,
                    npgsql => npgsql.MigrationsHistoryTable("__EFMigrationsHistory", "authentication"));
            });

            builder.Services
                .AddIdentity<AuthUser, IdentityRole>(options =>
                {
                    options.Password.RequireDigit = true;
                    options.Password.RequiredLength = 1;
                    options.Password.RequireNonAlphanumeric = false;
                    options.Password.RequireUppercase = true;
                    options.Password.RequireLowercase = true;
                    options.User.RequireUniqueEmail = true;
                    options.SignIn.RequireConfirmedEmail = true;
                })
                .AddEntityFrameworkStores<AuthDbContext>()
                .AddDefaultTokenProviders();

            builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(options =>
                {
                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuer = true,
                        ValidIssuer = jwtOptions.Issuer,
                        ValidateAudience = true,
                        ValidAudience = jwtOptions.Audience,
                        ValidateLifetime = true,
                        ClockSkew = TimeSpan.Zero,
                        ValidateIssuerSigningKey = true,
                        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtOptions.Key))
                    };
                });

            builder.Services.AddAuthorization();

            builder.Services.AddProjectGrpcClients(serviceEndpoints, builder.Environment);
            builder.Services.AddSingleton<IEventPublisher, RabbitMqEventPublisher>();
            builder.Services.AddHostedService<OutboxProcessor>();

            var app = builder.Build();

            app.UseHttpsRedirection();
            app.UseRouting();
            app.UseAuthentication();
            app.UseAuthorization();
            app.MapGrpcService<AuthServiceImpl>();
            app.MapGet("/health", () => "Authentication Service is running").AllowAnonymous();

            app.Run();
        }
    }
}

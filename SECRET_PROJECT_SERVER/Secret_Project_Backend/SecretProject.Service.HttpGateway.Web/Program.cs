using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi;
using SecretProject.Data.Contracts.Channel;
using SecretProject.Service.HttpGateway.Web.Configuration;
using System.Text;

namespace SecretProject.Service.HttpGateway.Web
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);
            var jwtOptions = builder.Configuration
                .GetRequiredSection(JwtOptions.SectionName)
                .Get<JwtOptions>() ?? throw new InvalidOperationException("Jwt section is required.");
            var serviceEndpoints = builder.Configuration
                .GetRequiredSection(ServiceEndpointsOptions.SectionName)
                .Get<ServiceEndpointsOptions>() ?? throw new InvalidOperationException("Services section is required.");

            builder.Services.AddControllers();
            builder.Services.AddOptions<JwtOptions>()
                .Bind(builder.Configuration.GetRequiredSection(JwtOptions.SectionName))
                .Validate(options => !string.IsNullOrWhiteSpace(options.Key), "Jwt:Key is required.")
                .Validate(options => !string.IsNullOrWhiteSpace(options.Issuer), "Jwt:Issuer is required.")
                .Validate(options => !string.IsNullOrWhiteSpace(options.Audience), "Jwt:Audience is required.")
                .ValidateOnStart();
            builder.Services.AddOptions<ServiceEndpointsOptions>()
                .Bind(builder.Configuration.GetRequiredSection(ServiceEndpointsOptions.SectionName))
                .Validate(options => !string.IsNullOrWhiteSpace(options.AuthService), "Services:AuthService is required.")
                .Validate(options => !string.IsNullOrWhiteSpace(options.ChannelService), "Services:ChannelService is required.")
                .ValidateOnStart();

            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowAll", policy =>
                {
                    policy.AllowAnyOrigin()
                          .AllowAnyMethod()
                          .AllowAnyHeader();
                });
            });

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

                    options.Events = new JwtBearerEvents
                    {
                        OnMessageReceived = context =>
                        {
                            var authorization = context.Request.Headers["Authorization"].FirstOrDefault();
                            if (!string.IsNullOrEmpty(authorization) && authorization.StartsWith("Bearer "))
                            {
                                context.Token = authorization["Bearer ".Length..].Trim();
                            }

                            return Task.CompletedTask;
                        }
                    };
                });

            builder.Services.AddAuthorization();

            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo
                {
                    Title = "Messenger API Gateway",
                    Version = "v1",
                    Description = "API Gateway for Messenger microservices"
                });

                c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
                {
                    Name = "Authorization",
                    Type = SecuritySchemeType.Http,
                    Scheme = "bearer",
                    BearerFormat = "JWT",
                    In = ParameterLocation.Header,
                    Description = "Введите JWT токен в поле ниже. Пример: 'Bearer 12345abcdef'"
                });
            });

            builder.Services.AddProjectGrpcClients(serviceEndpoints, builder.Environment);

            var app = builder.Build();

            app.UseSwagger();
            app.UseSwaggerUI(c =>
            {
                c.SwaggerEndpoint("/swagger/v1/swagger.json", "Messenger Gateway API V1");
                c.RoutePrefix = "swagger";
                c.ConfigObject.AdditionalItems["persistAuthorization"] = "true";
            });

            app.UseCors("AllowAll");
            app.UseHttpsRedirection();
            app.UseRouting();
            app.UseAuthentication();
            app.UseAuthorization();
            app.MapControllers();

            app.Run();
        }
    }
}

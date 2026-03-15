using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using SecretProject.Service.Authentication.Services.gRPC;
using System.Text;

namespace SecretProject.Service.Authentication
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            builder.Services.AddGrpc();

            builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(options =>
                {
                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuer = false,
                        ValidateAudience = false,
                        ValidateLifetime = false,
                        ValidateIssuerSigningKey = false,
                        IssuerSigningKey = new SymmetricSecurityKey(
                            Encoding.UTF8.GetBytes("your-secret-key-for-development-only"))
                    };

                    options.Events = new JwtBearerEvents
                    {
                        OnMessageReceived = context =>
                        {
                            var authorization = context.Request.Headers["Authorization"].FirstOrDefault();

                            if (!string.IsNullOrEmpty(authorization) && authorization.StartsWith("Bearer "))
                            {
                                context.Token = authorization.Substring("Bearer ".Length).Trim();
                            }

                            return Task.CompletedTask;
                        }
                    };
                });

            builder.Services.AddAuthorization();

      
            var app = builder.Build();


            app.UseHttpsRedirection();

            
            app.UseRouting();

            app.UseAuthentication();  
            app.UseAuthorization();   

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapGrpcService<AuthServiceImpl>();

                endpoints.MapGet("/health", () => "Authentication Service is running")
                    .AllowAnonymous();
            });

            app.Run();
        }
    }
}
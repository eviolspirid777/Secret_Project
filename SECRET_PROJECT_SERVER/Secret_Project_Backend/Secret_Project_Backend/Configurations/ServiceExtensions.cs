using Microsoft.EntityFrameworkCore;
using Secret_Project_Backend.Context;

namespace Secret_Project_Backend.Configurations
{
    public static class ServiceExtensions
    {
        public static void AddDbService<T>(this IServiceCollection services, string? connectionString) where T : PostgreSQLDbContext
        {
            services.AddDbContext<T>(options =>
            {
                options.UseNpgsql(connectionString);
            });
        }

        public enum CORS_ENUM
        {
            LOCAL = 0,
            ANY = 1,
            DEPLOY = 2
        }
        public static void AddCorsService(this IServiceCollection services, CORS_ENUM type)
        {
            services.AddCors(options =>
            {
                options.AddPolicy("AllowSpecificOrigin", policy =>
                {
                    switch (type)
                    {
                        case CORS_ENUM.LOCAL:
                            {
                                policy.WithOrigins("http://localhost:5173") // Разрешаем конкретный домен клиента
                                        .AllowAnyHeader()
                                        .AllowAnyMethod()
                                        .AllowCredentials(); // Разрешаем передачу cookies и авторизационных данных
                                break;
                            }
                        case CORS_ENUM.ANY:
                            {
                                policy
                                    .AllowAnyOrigin()
                                    .AllowAnyHeader()
                                    .AllowAnyMethod();
                                break;
                            }
                        case CORS_ENUM.DEPLOY:
                            {
                                policy.WithOrigins("https://parkmobile.store")
                                    .AllowAnyHeader()
                                    .AllowAnyMethod()
                                    .AllowCredentials();
                                break;
                            }
                    }
                });
            });
        }
    }
}

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
    }
}

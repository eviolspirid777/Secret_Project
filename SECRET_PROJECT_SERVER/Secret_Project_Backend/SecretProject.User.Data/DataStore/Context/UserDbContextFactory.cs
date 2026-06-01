using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace SecretProject.User.Data.DataStore.Context;

public sealed class UserDbContextFactory : IDesignTimeDbContextFactory<UserDbContext>
{
    public UserDbContext CreateDbContext(string[] args)
    {
        var connectionString = AppSettingsConnectionStringReader.Read(
            "SecretProject.Service.User",
            "PostgreSQL");

        var options = new DbContextOptionsBuilder<UserDbContext>()
            .UseNpgsql(
                connectionString,
                npgsql => npgsql.MigrationsHistoryTable("__EFMigrationsHistory", "user"))
            .Options;

        return new UserDbContext(options);
    }

    private static class AppSettingsConnectionStringReader
    {
        public static string Read(string serviceDirectoryName, string connectionStringName)
        {
            var backendRoot = FindBackendRoot();
            var appsettingsPath = Path.Combine(backendRoot, serviceDirectoryName, "appsettings.json");

            using var document = JsonDocument.Parse(File.ReadAllText(appsettingsPath));
            var connectionString = document.RootElement
                .GetProperty("ConnectionStrings")
                .GetProperty(connectionStringName)
                .GetString();

            if (string.IsNullOrWhiteSpace(connectionString))
            {
                throw new InvalidOperationException(
                    $"ConnectionStrings:{connectionStringName} is missing in {appsettingsPath}");
            }

            return connectionString;
        }

        private static string FindBackendRoot()
        {
            var directory = new DirectoryInfo(Directory.GetCurrentDirectory());

            while (directory is not null)
            {
                if (directory.Name == "Secret_Project_Backend")
                {
                    return directory.FullName;
                }

                directory = directory.Parent;
            }

            throw new InvalidOperationException("Cannot find Secret_Project_Backend directory.");
        }
    }
}

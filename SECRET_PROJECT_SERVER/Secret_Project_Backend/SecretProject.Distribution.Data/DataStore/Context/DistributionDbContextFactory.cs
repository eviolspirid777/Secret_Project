using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace SecretProject.Distribution.Data.DataStore.Context;

public sealed class DistributionDbContextFactory : IDesignTimeDbContextFactory<DistributionDbContext>
{
    public DistributionDbContext CreateDbContext(string[] args)
    {
        var connectionString = AppSettingsConnectionStringReader.Read(
            "SecretProject.Service.Email",
            "PostgreSQL");

        var options = new DbContextOptionsBuilder<DistributionDbContext>()
            .UseNpgsql(
                connectionString,
                npgsql => npgsql.MigrationsHistoryTable("__EFMigrationsHistory", "distribution"))
            .Options;

        return new DistributionDbContext(options);
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

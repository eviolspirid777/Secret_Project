using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using System.Text.Json;

namespace SecretProject.File.Data.DataStore.Context;

internal class FileDbContextFactory : IDesignTimeDbContextFactory<FileDbContext>
{
    public FileDbContext CreateDbContext(string[] args)
    {
        var connectionString = AppSettingsConnectionStringReader.Read(
            "SecretProject.Service.File",
            "PostgreSQL");

        var options = new DbContextOptionsBuilder<FileDbContext>()
            .UseNpgsql(
                connectionString,
                npgsql => npgsql.MigrationsHistoryTable("__EFMigrationsHistory", "file"))
            .Options;

        return new FileDbContext(options);
    }

    private static class AppSettingsConnectionStringReader
    {
        public static string Read(string serviceDirectoryName, string connectionStringName)
        {
            var backendRoot = FindBackendRoot();
            var appsettingsPath = Path.Combine(backendRoot, serviceDirectoryName, "appsettings.json");

            using var document = JsonDocument.Parse(System.IO.File.ReadAllText(appsettingsPath));
            var connectionString = document.RootElement
                .GetProperty("ConnectionStrings")
                .GetProperty(connectionStringName)
                .GetString();

            if (string.IsNullOrWhiteSpace(connectionString))
            {
                throw new InvalidOperationException(
                    $"ConnectionStrings:{connectionStringName} нет по пути {appsettingsPath}");
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

            throw new InvalidOperationException("Не получилось найти папку Secret_Project_Backend.");
        }
    }
}

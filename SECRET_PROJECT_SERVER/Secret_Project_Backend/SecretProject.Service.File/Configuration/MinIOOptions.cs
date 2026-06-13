namespace SecretProject.Service.File.Configuration
{
    public class MinIOOptions
    {
        public const string SectionName = "MinIO";

        public string Endpoint { get; init; } = string.Empty;
        public string AccessKey { get; init; } = string.Empty;
        public string SecretKey { get; init; } = string.Empty;
        public string BucketName { get; init; } = string.Empty;
        public bool UseSsl { get; init; }
        public int PresignedUploadTtlMinutes { get; init; } = 15;
        public long MaxFileSizeBytes { get; init; } = 100 * 1024 * 1024;
    }
}

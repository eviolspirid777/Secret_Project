using System;
using System.Collections.Generic;
using System.Text;

namespace SecretProject.File.Data.DataStore.Entities
{
    public sealed class FileMetadata
    {
        public Guid Id { get; set; }
        public string OwnerUserId { get; set; } = string.Empty;

        public string OriginalFileName { get; set; } = string.Empty;
        public string ContentType { get; set; } = string.Empty;
        public long SizeBytes { get; set; }

        public string BucketName { get; set; } = string.Empty;
        public string ObjectKey { get; set; } = string.Empty;

        public FileStatus Status { get; set; }

        public DateTimeOffset CreatedAtUtc { get; set; }
        public DateTimeOffset UploadExpiresAtUtc { get; set; }
        public DateTimeOffset? UploadedAtUtc { get; set; }

        public string? Checksum { get; set; }
    }

    public enum FileStatus
    {
        PendingUpload = 0,
        Uploaded = 1,
        Reserved = 2,
        Attached = 3,
        Deleted = 4,
        Failed = 5
    }
}

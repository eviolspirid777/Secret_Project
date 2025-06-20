﻿using Amazon.S3;
using Amazon.S3.Transfer;

namespace Secret_Project_Backend.Services.S3
{
    public class S3ServiceAvatars
    {
        private readonly AmazonS3Client _s3Client;
        private readonly string _bucketName = "secret-project-avatars";

        private readonly string secret_key = "38FuKfCBeGdba4tbevxRHjCNYWGijauKoZCArQjKLxN2";
        private readonly string access_key = "fhAG6zj1VzYpDJyUiNKdKC";


        private readonly AmazonS3Config config = new()
        {
            ServiceURL = "https://hb.ru-msk.vkcloud-storage.ru",
            ForcePathStyle = true,
        };

        public S3ServiceAvatars()
        {
            _s3Client = new AmazonS3Client(access_key, secret_key, config);
        }

        public async Task<string> UploadAvatarAsync(Stream stream, string fileName)
        {
            var uploadRequest = new TransferUtilityUploadRequest
            {
                InputStream = stream,
                Key = fileName,
                BucketName = _bucketName,
                CannedACL = S3CannedACL.PublicRead,
            };

            var fileTransferUtility = new TransferUtility(_s3Client);
            await fileTransferUtility.UploadAsync(uploadRequest);

            return $"https://hb.ru-msk.vkcloud-storage.ru/{_bucketName}/{fileName}";
        }

        public async Task<Stream> GetFileAsync(string fileName)
        {
            using var response = await _s3Client.GetObjectAsync(_bucketName, fileName);

            var memoryStream = new MemoryStream();
            await response.ResponseStream.CopyToAsync(memoryStream);
            memoryStream.Position = 0;
            return memoryStream;
        }

        public async Task<bool> DeleteFileAsync(string fileName)
        {
            try
            {
                var response = await _s3Client.DeleteObjectAsync(_bucketName, fileName);
                return true;
            }
            catch (Exception)
            {
                return false;
            }
        }
    }
}

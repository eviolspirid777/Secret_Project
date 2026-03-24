using Microsoft.IdentityModel.Tokens;
using Riok.Mapperly.Abstractions;
using SecretProject.Platform.Data.DataStore.DTOs.User;
using SecretProject.Platform.Data.DataStore.Models;
using GrpcModels = SecretProject.Service.Grpc.v1.Proto;


namespace SecretProject.Service.HttpGateway.Web.DataStore.Mappers.User
{
    [Mapper(EnumMappingStrategy = EnumMappingStrategy.ByName)]
    public static partial class UserMapper
    {
        #region ToHttp
        public static UserDTO ToDto(this GrpcModels.User source)
        {
            return new UserDTO
            {
                UserId = Guid.Parse(source.Id),
                Name = source.Name,
                Avatar = source.Avatar,
                Email = source.Email,
                Status = source.Status,
                States = Map(source.SoundState)
            };
        }

        private static SoundConnectionState Map(GrpcModels.SoundConnectionState source)
        {
            SoundConnectionState result = new();

            result.IsMicrophoneMuted = source.IsMicroMuted ? true : false;
            result.IsHeadphonesMuted = source.IsHeadphonesMuted ? true : false;
            return result;
        }

        #endregion
    }
}

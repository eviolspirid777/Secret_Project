using Google.Protobuf.WellKnownTypes;
using Riok.Mapperly.Abstractions;
using SecretProject.Authentication.Data.DataStore.Entities;
using GrpcModels = SecretProject.Service.Grpc.v1.Proto;

namespace SecretProject.Service.Authentication.Storage.Mappers
{
    [Mapper(EnumMappingStrategy = EnumMappingStrategy.ByName)]

    #region ToGrpc
    public static partial class UserMapper
    {
        public static GrpcModels.User ToGrpc(AuthUser source)
        {
            return new()
            {
                Id = source.Id,
                Email = source.Email,
                Name = source.DisplayName,
                SoundState = new(),
                Status = "Статус неизвестен"
            };
        }
    }

    #endregion
}

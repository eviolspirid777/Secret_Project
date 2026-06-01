using Riok.Mapperly.Abstractions;
using SecretProject.Data.Contracts.User;
using SecretProject.User.Data.DataStore.Entities;

namespace SecretProject.Service.User.Storage.Mappers
{
    [Mapper(EnumMappingStrategy = EnumMappingStrategy.ByName)]

    #region ToGrpc
    public static partial class UserMapper
    {
        public static GetUserInformationResponse ToGrpc(this UserProfile source)
        {
            return new()
            {
                Id = source.Id.ToString(),
                Email = "Надо расширить модель",
                Name = source.Name,
                SoundState = new(),
                Status = "Статус неизвестен"
            };
        }
    }

    #endregion
}

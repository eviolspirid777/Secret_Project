using SecretProject.Data.Contracts.User;

namespace SecretProject.Service.User.Abstractions
{
    public interface IUserService
    {
        Task<GetUserInformationResponse> GetUserInformation(Guid id);
        Task<ChangeUserStatusResponse> ChangeUserStatus(Guid id, string status);
    }
}

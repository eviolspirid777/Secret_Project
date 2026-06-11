using SecretProject.Service.HttpGateway.Web.DataStore.Authentication.Requests;

namespace SecretProject.Service.HttpGateway.Web.DataStore.Mappers.Auth;

public static class AuthMapper
{
    public static SecretProject.Data.Contracts.Authentication.RegisterRequest ToGrpc(this RegisterHttpRequest request)
    {
        return new SecretProject.Data.Contracts.Authentication.RegisterRequest
        {
            Email = request.Email,
            Password = request.Password,
            DisplayName = request.DisplayName
        };
    }

    public static SecretProject.Data.Contracts.Authentication.LoginRequest ToGrpc(this LoginHttpRequest request)
    {
        return new SecretProject.Data.Contracts.Authentication.LoginRequest
        {
            Email = request.Email,
            Password = request.Password
        };
    }
}

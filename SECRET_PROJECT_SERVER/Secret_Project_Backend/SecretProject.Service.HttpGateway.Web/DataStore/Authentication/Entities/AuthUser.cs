using Microsoft.AspNetCore.Identity;

namespace SecretProject.Service.HttpGateway.Web.DataStore.Authentication.Entities
{
    public class AuthUser : IdentityUser
    {
        #region Props
        public required string DisplayName { get; set; } = string.Empty;
        public string? AvatarUrl { get; set; } = null;
        #endregion

        #region Links

        #endregion
    }
}

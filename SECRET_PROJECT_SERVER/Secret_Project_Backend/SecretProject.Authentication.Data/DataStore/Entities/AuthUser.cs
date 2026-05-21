using Microsoft.AspNetCore.Identity;

namespace SecretProject.Authentication.Data.DataStore.Entities;


public class AuthUser : IdentityUser<Guid>
{
    #region Props
    public required string DisplayName { get; set; } = string.Empty;
    #endregion

    #region Links

    #endregion
}

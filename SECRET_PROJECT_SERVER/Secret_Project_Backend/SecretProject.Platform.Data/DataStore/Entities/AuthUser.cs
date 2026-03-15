using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Text;

namespace SecretProject.Platform.Data.DataStore.Entities
{
    public class AuthUser : IdentityUser
    {
        #region Props
        public required string DisplayName { get; set; } = string.Empty;
        public string? AvatarUrl { get; set; } = null;
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        #endregion

        #region Links

        #endregion
    }
}

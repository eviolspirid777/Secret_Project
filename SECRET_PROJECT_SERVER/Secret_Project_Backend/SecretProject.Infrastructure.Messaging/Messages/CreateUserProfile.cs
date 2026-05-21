using System;
using System.Collections.Generic;
using System.Text;

namespace SecretProject.Infrastructure.Messaging.Messages
{
    public record CreateUserProfile(Guid UserId, string Email, string DisplayName);
}

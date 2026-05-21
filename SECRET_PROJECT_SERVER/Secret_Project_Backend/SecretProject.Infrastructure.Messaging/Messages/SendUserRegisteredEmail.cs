using System;
using System.Collections.Generic;
using System.Text;

namespace SecretProject.Infrastructure.Messaging.Messages
{
    public record SendUserRegisteredEmail(Guid UserId, string Email, string ConfirmationToken);
}

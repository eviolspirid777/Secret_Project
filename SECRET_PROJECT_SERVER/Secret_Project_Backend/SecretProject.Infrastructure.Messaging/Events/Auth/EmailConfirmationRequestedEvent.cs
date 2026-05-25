using System;
using System.Collections.Generic;
using System.Text;

namespace SecretProject.Infrastructure.Messaging.Events.Auth
{
    public sealed class EmailConfirmationRequestedEvent
    {
        public required Guid UserId { get; set; }
        public required string Email { get; set; }
        public required string ConfirmationToken { get; set; }
    }
}

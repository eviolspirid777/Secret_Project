using System;
using System.Collections.Generic;
using System.Text;

namespace SecretProject.Distribution.Data.Messages.Templates
{
    public class ConfirmationEmailMessage : MessageBase
    {
        public ConfirmationEmailMessage(string subject, string message) : base(subject, message)
        {
        }
    }
}

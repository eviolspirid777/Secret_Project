using SecretProject.Distribution.Data.Messages.MagicPhrases.Messages;

namespace SecretProject.Distribution.Data.Constructors.Messages
{
    public interface IEmailMessageConstructor
    {
        string GetEmailConfirmationMessage(string confirmationLink);
    }

    public class EmailMessageConstructor : IEmailMessageConstructor
    {
        public string GetEmailConfirmationMessage(string confirmationLink)
        {
            return string.Format(ConfirmationMessages.EmailConfirmationMessage, confirmationLink);
        }
    }
}

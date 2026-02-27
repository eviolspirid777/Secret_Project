using Microsoft.Extensions.Configuration;
using SecretProject.Distribution.Data.Links;
using SecretProject.Distribution.Data.Messages.MagicPhrases.Messages;
using SecretProject.Distribution.Data.Messages.MagicPhrases.Subjects;
using SecretProject.Distribution.Data.Messages.Templates;


namespace SecretProject.Distribution.Data.Messages.Factories
{
    public interface IMessageFactory
    {
        ConfirmationEmailMessage CreateConfirmationMessage(IConfiguration config, string userId, string link);
    }

    public class MessageFactory : IMessageFactory
    {
        public ConfirmationEmailMessage CreateConfirmationMessage(IConfiguration config, string userId, string token)
        {
            var link = config.GetEmailConfirmationLink(userId, token);
            var message = Confirmation.GetConfirmationMessage(link);

            return new ConfirmationEmailMessage(SubjectTemplates.EmailConfirmationSubject, message);
        }
    }
}

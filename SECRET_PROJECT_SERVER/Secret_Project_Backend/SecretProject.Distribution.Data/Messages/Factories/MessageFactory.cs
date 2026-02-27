using Microsoft.Extensions.Configuration;
using SecretProject.Distribution.Data.Constructors.Links;
using SecretProject.Distribution.Data.Constructors.Messages;
using SecretProject.Distribution.Data.Messages.MagicPhrases.Subjects;
using SecretProject.Distribution.Data.Messages.Templates;


namespace SecretProject.Distribution.Data.Messages.Factories
{
    public interface IMessageFactory
    {
        ConfirmationEmailMessage CreateEmailConfirmationMessage(IConfiguration config, string userId, string token);
    }

    public class MessageFactory : IMessageFactory
    {
        private readonly IEmailMessageConstructor _messageConstructor;
        private readonly ILinkConstructor _linkConstructor;

        public MessageFactory(IEmailMessageConstructor messageConstructor, ILinkConstructor linkConstructor)
        {
            _messageConstructor = messageConstructor;
            _linkConstructor = linkConstructor;
        }
        public ConfirmationEmailMessage CreateEmailConfirmationMessage(IConfiguration config, string userId, string token)
        {
            var link = _linkConstructor.GetEmailConfirmationLink(config, userId, token);
            var message = _messageConstructor.GetEmailConfirmationMessage(link);

            return new ConfirmationEmailMessage(SubjectTemplates.EmailConfirmationSubject, message);
        }
    }
}

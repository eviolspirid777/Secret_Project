using Microsoft.Extensions.Configuration;
using SecretProject.Distribution.Data.Messages.MagicPhrases.Keys;

namespace SecretProject.Distribution.Data.Constructors.Links
{
    public interface ILinkConstructor
    {
        string GetEmailConfirmationLink(IConfiguration configuration, string userId, string token);
    }
    public class LinkConstructor
    {
        public string GetEmailConfirmationLink(IConfiguration configuration, string userId, string token)
        {
            var baseUrl = configuration[ConfigKeys.ApplicationUrl]?.TrimEnd('/');

            if (string.IsNullOrEmpty(baseUrl))
                throw new InvalidOperationException("ApplicationUrl не настроен в конфигурации");

            if (string.IsNullOrEmpty(userId))
                throw new InvalidOperationException("UserId не настроен в конфигурации");

            if (string.IsNullOrEmpty(token))
                throw new InvalidOperationException("Token не настроен в конфигурации");

            return $"{baseUrl}/Auth/confirm-email?UserId={userId}&Token={Uri.EscapeDataString(token)}";
        }
    }
}

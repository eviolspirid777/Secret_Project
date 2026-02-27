namespace SecretProject.Distribution.Data.Messages.MagicPhrases.Messages
{
    public static class Confirmation
    {
        public static string GetConfirmationMessage(string confirmationLink)
        {
            return $@"
            <div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;'>
                <h2 style='color: #333;'>Подтверждение регистрации</h2>
                <p style='color: #666;'>Спасибо за регистрацию! Для подтверждения вашего email адреса, пожалуйста, перейдите по ссылке ниже:</p>
                <p style='margin: 20px 0;'>
                    <a href='{confirmationLink}' 
                       style='background-color: #4CAF50; 
                              color: white; 
                              padding: 10px 20px; 
                              text-decoration: none; 
                              border-radius: 5px; 
                              display: inline-block;'>
                        Подтвердить email
                    </a>
                </p>
                <p style='color: #666;'>Если вы не регистрировались на нашем сайте, просто проигнорируйте это письмо.</p>
                <hr style='border: 1px solid #eee; margin: 20px 0;'>
                <p style='color: #999; font-size: 12px;'>Это письмо отправлено автоматически, пожалуйста, не отвечайте на него.</p>
            </div>";
        }


        public const string HtmlTemplate = @"
        <div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;'>
            <h2 style='color: #333;'>Подтверждение регистрации</h2>
            <p style='color: #666;'>Спасибо за регистрацию! Для подтверждения вашего email адреса, пожалуйста, перейдите по ссылке ниже:</p>
            <p style='margin: 20px 0;'>
                <a href='{0}' 
                   style='background-color: #4CAF50; 
                          color: white; 
                          padding: 10px 20px; 
                          text-decoration: none; 
                          border-radius: 5px; 
                          display: inline-block;'>
                    Подтвердить email
                </a>
            </p>
            <p style='color: #666;'>Если вы не регистрировались на нашем сайте, просто проигнорируйте это письмо.</p>
            <hr style='border: 1px solid #eee; margin: 20px 0;'>
            <p style='color: #999; font-size: 12px;'>Это письмо отправлено автоматически, пожалуйста, не отвечайте на него.</p>
        </div>";
    }
}

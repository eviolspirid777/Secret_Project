namespace SecretProject.Distribution.Data.Messages.Templates
{
    public class MessageBase
    {
        public string Subject { get; set; }
        public string Text { get; set; }
        
        public MessageBase(string subject, string message)
        {
            Subject = subject;
            Text = message;
        }
    }
}

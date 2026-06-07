namespace SecretProject.Service.Email.DataStore.Exceptions
{
    public sealed class EmailDeliveryException : Exception
    {
        public EmailDeliveryException(string email, string subject, Exception innerException)
            : base($"Failed to deliver email to '{email}' with subject '{subject}'.", innerException)
        {
            Email = email;
            Subject = subject;
        }

        public string Email { get; }
        public string Subject { get; }
    }
}

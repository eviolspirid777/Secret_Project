namespace SecretProject.Service.Authentication.Storage.Models.Auth.Requests
{
    public class LoginRequest
    {
        public required string Email { get; set; }
        public required string Password { get; set; }
    }
}

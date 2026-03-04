namespace SecretProject.Service.HttpGateway.Web.DataStore.Authentication.Requests
{
    public class LoginRequest
    {
        public required string Email { get; set; }
        public required string Password { get; set; }
    }
}

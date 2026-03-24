using SecretProject.Platform.Data.DataStore.Entities;
using System.Security.Claims;

namespace SecretProject.Service.HttpGateway.Web.Utils
{
    public static class JwtTokenGenerator
    {
        public static (string, DateTime) GenerateJwtToken(AuthUser user, string? secretKey)
        {
            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id),
                new Claim(ClaimTypes.Name, user.UserName ?? "")
            };


            var key = new Microsoft.IdentityModel.Tokens.SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes(secretKey ?? ""));
            var creds = new Microsoft.IdentityModel.Tokens.SigningCredentials(key, Microsoft.IdentityModel.Tokens.SecurityAlgorithms.HmacSha256);
            var expirationDate = DateTime.Now.AddDays(1);

            var token = new System.IdentityModel.Tokens.Jwt.JwtSecurityToken(
                issuer: "secret_issuer",
                audience: "secret_audience",
                claims: claims,
                expires: expirationDate,
                signingCredentials: creds);

            return (new System.IdentityModel.Tokens.Jwt.JwtSecurityTokenHandler().WriteToken(token), expirationDate);
        }
    }
}

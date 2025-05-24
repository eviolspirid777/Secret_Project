using Secret_Project_Backend.Models;

namespace Secret_Project_Backend.Utils
{
    public static class JwtToken
    {
        public static (string, DateTime) GenerateJwtToken(ApplicationUser user, string secretKey)
        {
            var claims = new[]
            {
                new System.Security.Claims.Claim(System.Security.Claims.ClaimTypes.NameIdentifier, user.Id),
                new System.Security.Claims.Claim(System.Security.Claims.ClaimTypes.Name, user.UserName)
            };


            var key = new Microsoft.IdentityModel.Tokens.SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes(secretKey));
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

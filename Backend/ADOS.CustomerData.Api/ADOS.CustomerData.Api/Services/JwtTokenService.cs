using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using ADOS.CustomerData.Api.Entities;
using Microsoft.IdentityModel.Tokens;

namespace ADOS.CustomerData.Api.Services;

public interface IJwtTokenService
{
    string CreateToken(User user);
}

public class JwtTokenService : IJwtTokenService
{
    private readonly IConfiguration _configuration;

    public JwtTokenService(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public string CreateToken(User user)
    {
        var jwtKey = _configuration["Jwt:Key"];
        if (string.IsNullOrWhiteSpace(jwtKey))
        {
            throw new InvalidOperationException("Jwt:Key configuration is missing.");
        }

        var claims = new List<Claim>
        {
            new("UserId", user.Id.ToString()),
            new("FullName", user.FullName),
            new("Email", user.Email),
            new("Role", user.Role),
            new(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new(ClaimTypes.Name, user.FullName),
            new(ClaimTypes.Email, user.Email),
            new(ClaimTypes.Role, user.Role),
        };

        var signingKey = new SymmetricSecurityKey(SHA256.HashData(Encoding.UTF8.GetBytes(jwtKey)));
        var credentials = new SigningCredentials(signingKey, SecurityAlgorithms.HmacSha256);
        var token = new JwtSecurityToken(
            claims: claims,
            expires: DateTime.UtcNow.AddHours(8),
            signingCredentials: credentials);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}

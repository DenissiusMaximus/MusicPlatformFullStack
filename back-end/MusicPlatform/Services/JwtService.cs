using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;

namespace MusicPlatform.Services;

public class JwtService : IJwtService
{
    private readonly string _secret;

    public JwtService(IConfiguration configuration)
    {
        var secret = configuration.GetValue<string>("Jwt:Secret")
                     ?? throw new Exception("JWT refresh secret not found");

        _secret = secret;
    }

    public string GenerateToken(int id, string? role = null)
        => GenerateToken(id, () => DateTime.UtcNow.AddDays(30), role, _secret);


    public async Task<(int? Id, string? Role)?> ValidateToken(string token)
        => await ValidateToken(token, _secret);

    private string GenerateToken(int id, Func<DateTime> addLifeTime, string? role, string secret)
    {
        
        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, id.ToString()),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            new Claim(ClaimTypes.Role, role ?? "User") 
        };

        var key = new SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes(secret));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            claims: claims,
            expires: addLifeTime(),
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    public async Task<(int? Id, string? Role)?> ValidateToken(string token, string secret)
    {
        try
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.UTF8.GetBytes(secret);

            var parameters = new TokenValidationParameters
            {
                ValidateIssuer = false,
                ValidateAudience = false,
                ValidateLifetime = true,
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(key),
                ClockSkew = TimeSpan.Zero
            };

            var principal = tokenHandler.ValidateToken(token, parameters, out var validatedToken);

            var userIdClaim = principal.FindFirst(JwtRegisteredClaimNames.Sub)
                              ?? principal.FindFirst(ClaimTypes.NameIdentifier);
            
            var roleClaim = principal.FindFirst(ClaimTypes.Role);


            if (userIdClaim != null && int.TryParse(userIdClaim.Value, out var userId)
                && roleClaim != null && !string.IsNullOrEmpty(roleClaim.Value))
            {
                return (userId, roleClaim.Value);
            }

            return null;
        }
        catch
        {
            return null;
        }
    }
}
namespace MusicPlatform.Services;

public interface IJwtService
{
    string GenerateToken(int id, string? role = null);
    Task<(int? Id, string? Role)?> ValidateToken(string token);
}
namespace MusicPlatform.Services;

public interface IJwtProvider
{
    string GenerateToken(int id, string? role = null);
    Task<(int? Id, string? Role)?> ValidateToken(string token);
}
namespace MusicPlatform.Services;

public interface IPasswordHashProvider
{
    string HashPassword(string password);
    bool VerifyPassword(string password, string hashedPassword);
}
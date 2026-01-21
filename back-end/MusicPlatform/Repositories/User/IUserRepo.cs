using MusicPlatform.Models;

namespace MusicPlatform.Repositories;

public interface IUserRepo
{
    Task<int?> CreateUser(string login, string email, string password, DateTime? birthDate);
    Task<User?> ValidateUser(string login, string password);
    Task<UserDto?> GetUserById(int userId);
    Task<bool> IsUsernameAvailable(string username);
    Task<int?> CreateAdmin(string login, string email, string password);
}
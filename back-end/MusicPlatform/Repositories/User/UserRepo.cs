using System.Data;
using Dapper;
using Microsoft.Data.SqlClient;
using MusicPlatform.DataAccess;
using MusicPlatform.Models;
using MusicPlatform.Services;

namespace MusicPlatform.Repositories;

public class UserRepo(IDbConnectionFactory dbFactory) : IUserRepo
{
    public async Task<bool> IsUsernameAvailable(string username)
    {
        var sql = @"SELECT COUNT(*) FROM Users WHERE Login = @username";
        
        using var conn = dbFactory.CreateConnection();
        
        return await conn.QueryFirstOrDefaultAsync<int>(sql, new { username }) == 0;
    }

    public async Task<int?> CreateUser(string login, string email, string password, DateTime? birthDate)
    {
        var passwordHash = PasswordService.HashPassword(password);

        const string sql = @"INSERT INTO Users (Login, Email, PasswordHash, BirthDate) 
                             VALUES (@login, @email, @passwordHash, @birthDate)
                             SELECT CAST(SCOPE_IDENTITY() as int);";

        try
        {
            using var conn = dbFactory.CreateConnection();
            var newId = await conn.ExecuteScalarAsync<int>(sql, new { login, email, passwordHash, birthDate });

            return newId;
        }
        catch (SqlException ex)
        {
            if (ex.Number is 2627 or 2601)
                return null;

            throw;
        }
    }
    
    public async Task<int?> CreateAdmin(string login, string email, string password)
    {
        var passwordHash = PasswordService.HashPassword(password);

        const string sql = @"INSERT INTO Users (Login, Email, PasswordHash, Role) 
                             VALUES (@login, @email, @passwordHash, 'Admin')
                             SELECT CAST(SCOPE_IDENTITY() as int);";

        try
        {
            using var conn = dbFactory.CreateConnection();
            var newId = await conn.ExecuteScalarAsync<int>(sql, new { login, email, passwordHash });

            return newId;
        }
        catch (SqlException ex)
        {
            if (ex.Number is 2627 or 2601)
                return null;

            throw;
        }
    }

    

    public async Task<User?> ValidateUser(string login, string password)
    {
        var sql = @"SELECT * FROM Users WHERE Login = @login";

        using var db = dbFactory.CreateConnection();
        var user = await db.QueryFirstOrDefaultAsync<User>(sql, new { login });

        if (user != null && PasswordService.VerifyPassword(password, user.PasswordHash))
            return user;

        return null;
    }

    public async Task<UserDto?> GetUserById(int userId)
    {
        var sql = @"SELECT * FROM Users WHERE UserId = @userId";

        using var db = dbFactory.CreateConnection();
        return await db.QueryFirstOrDefaultAsync<UserDto>(sql, new { userId });
    }
}
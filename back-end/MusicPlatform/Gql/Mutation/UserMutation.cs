using GraphQL;
using MusicPlatform.Dto;
using MusicPlatform.Repositories;
using MusicPlatform.Services;

namespace MusicPlatform.Gql.Mutation;

public class UserMutation(IUserRepo repo, IJwtService jwtService)
{
    public async Task<AuthentificationDto?> Register(string login, string email, string password,
        DateTime? birthDate)
    {
        var res = await repo.CreateUser(login, email, password, birthDate);
    
        if (res == null) return null;
    
        return new AuthentificationDto { Token = jwtService.GenerateToken(res.Value) };
    }
    
    public async Task<AuthentificationDto?> Login(string login, string password)
    {
        var res = await repo.ValidateUser(login, password);
    
        if (res?.UserId == null) return null;
    
        return new AuthentificationDto { Token = jwtService.GenerateToken(res.UserId, res.Role) };
    }

    public async Task<int?> CreateAdmin(string login, string email, string password, IResolveFieldContext context)
    {
        var isAdmin = context.GetUserRole() == "Admin";
        
        return isAdmin ? await repo.CreateAdmin(login, email, password) : null;
    }
}
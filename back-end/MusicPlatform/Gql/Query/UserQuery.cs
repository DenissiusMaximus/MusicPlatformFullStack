using MusicPlatform.Dto;
using MusicPlatform.Models;
using MusicPlatform.Repositories;
using MusicPlatform.Services;

namespace MusicPlatform.Gql;

public class UserQuery(IUserRepo repo, IJwtService jwtService)
{
    public async Task<bool> IsUsernameAvailable(string username)
    {
        return await repo.IsUsernameAvailable(username);
    }

    public async Task<UserDto> GetUser(int id)
    {
        return await repo.GetUserById(id);
    }
}
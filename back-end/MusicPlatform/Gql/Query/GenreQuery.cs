using GraphQL;
using MusicPlatform.Repositories.Genre;

namespace MusicPlatform.Gql.Query;

public class GenreQuery(IGenreRepo repo)
{
    public async Task<IEnumerable<Models.Genre>> GetGenres()
    {
        return await repo.GetGenres();
    }
}
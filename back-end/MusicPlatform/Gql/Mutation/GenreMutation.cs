using GraphQL;
using MusicPlatform.Repositories.Genre;

namespace MusicPlatform.Gql.Mutation;

public class GenreMutation(IGenreRepo repo)
{
    public async Task<bool> CreateGenre(string name)
    {
        return await repo.CreateGenre(name);
    }

    public async Task<bool> DeleteGenre(int genreId)
    {
        return await repo.DeleteGenre(genreId);
    }

    public async Task<bool> SetToTrack(int trackId, List<int> genres, IResolveFieldContext context)
    {
        var currentUserId = context.GetUserId();
        
        return await repo.SetToTrack(trackId, genres, currentUserId);
    }
}
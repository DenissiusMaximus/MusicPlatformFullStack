using GraphQL;
using MusicPlatform.Repositories.Listen;

namespace MusicPlatform.Gql.Mutation;

public class ListenMutation(IListenRepo repo)
{
    public async Task<bool> AddListen(int trackId, IResolveFieldContext context, DateTime? date = null)
    {
        var userId = context.GetUserId();
        
        date ??= DateTime.Now;

        return await repo.AddListen(userId, trackId, date.Value);
    }
}
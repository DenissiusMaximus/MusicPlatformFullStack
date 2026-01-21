using MusicPlatform.Dto;
using MusicPlatform.Repositories.Listen;

namespace MusicPlatform.Gql.Query;

public class ListenQuery(IListenRepo repo)
{
    public async Task<IEnumerable<Top10TracksDto>> GetTracksTop()
    {
        return await repo.GetTracksTop();
    }
}
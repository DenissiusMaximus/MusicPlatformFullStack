using GraphQL;
using MusicPlatform.Dto;
using MusicPlatform.Models;
using MusicPlatform.Repositories.Track;
using MusicPlatform.Services;

namespace MusicPlatform.Gql.Query;

public class TrackQuery(ITrackRepo repo, FileService fileService)
{
    public async Task<TrackDto?> GetSingle(int id)
    {
        var track = await repo.GetById(id);
        
        
        return fileService.SetFullUrl(track);
    }
    
    public async Task<IEnumerable<TrackDto>?> GetByUser(int userId)
    {
        var tracks = await repo.GetByUserId(userId);
        
        if (tracks is null) return null;
        
        tracks.ToList().ForEach(t => fileService.SetFullUrl(t));
        
        return tracks;
    }

    public async Task<bool?> CanEdit(IResolveFieldContext context, int trackId)
    {
        var userId = context.GetUserId();

        return await repo.ChekTrackOwner(trackId, userId);
    }
}
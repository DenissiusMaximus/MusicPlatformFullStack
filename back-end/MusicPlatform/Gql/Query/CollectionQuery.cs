using GraphQL;
using MusicPlatform.Dto;
using MusicPlatform.Repositories;
using MusicPlatform.Services;

namespace MusicPlatform.Gql;

public class CollectionQuery(ICollectionRepo repo, FileService fileService)
{
    public async Task<IEnumerable<CollectionDto>?> UserPlaylists(IResolveFieldContext context)
    {
        var userId = context.GetUserId();

        var res = (await repo.GetCollectionByUserId(userId))?.Where(x => x.CollectionType == "Playlist");

        if (res is null) return null;

        foreach (var c in res)
        {
            if (c.IconLink is not null)
                c.IconLink = fileService.SetFullUrl(c.IconLink);

            if (c.Songs is null) continue;

            foreach (var s in c.Songs)
            {
                if (s.TrackLink is not null)
                    s.TrackLink = fileService.SetFullUrl(s.TrackLink);
                if (s.IconLink is not null)
                    s.IconLink = fileService.SetFullUrl(s.IconLink);
            }
        }

        return res.ToList();
    }

    public async Task<CollectionDto?> GetById(int id, IResolveFieldContext context)
    {
        var userId = context.GetUserId();

        var res = await repo.GetCollectionById(id, userId);

        if (res is { IconLink: not null })
            res.IconLink = fileService.SetFullUrl(res.IconLink);

        if (res?.Songs is null) return res;

        foreach (var s in res.Songs)
        {
            if (s.TrackLink is null ) continue;
            s.TrackLink = fileService.SetFullUrl(s.TrackLink);
            if (s.IconLink is null ) continue;
            s.IconLink = fileService.SetFullUrl(s.IconLink);
        }


        return res;
    }
    
    public async Task<bool?> CanEdit(int collectionId, IResolveFieldContext context)
    {
        var currentUserId = context.GetUserId();

        var res = await repo.ChekCollectionOwner(collectionId, currentUserId);
        
        return res;
    }
}
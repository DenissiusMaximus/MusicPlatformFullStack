using GraphQL;
using GraphQL.Server.Transports.AspNetCore;
using MusicPlatform.Repositories.Track;
using MusicPlatform.Models;
using MusicPlatform.Services;

namespace MusicPlatform.Gql.Mutation;

public class TrackMutation(ITrackRepo repo, FileService fileService)
{
    public async Task<bool> RemoveTrack(int trackId, IResolveFieldContext context)
    {
        var userId = context.GetUserId();
        
        return await repo.DeleteTrack(trackId, userId);
    }
    
    public async Task<int?> CreateTrack(
        IResolveFieldContext context, 
        [MediaType("audio/mpeg")] IFormFile audioFile, 
        string name, string? description,
        DateTime? releaseDate = null, bool isExplicit = false, 
        [MediaType("image/png")] IFormFile? icon = null,
        List<int>? genres = null
        )
    {
        var userId = context.GetUserId();
        
        string? iconUrl = null;
        
        if (icon != null)
            iconUrl = (await fileService.SaveFileAsync(icon, "icons")).Url;
        
        var audio = (await fileService.SaveFileAsync(audioFile, "audio"));

        releaseDate ??= DateTime.UtcNow;
        
        if (releaseDate > DateTime.UtcNow)
            return null;

        var newTrack = new Track
        {
            UserId = userId,
            Description = description,
            Name = name,
            IconLink = iconUrl,
            IsExplicit = isExplicit,
            TrackLink = audio.Url,
            ReleaseDate = releaseDate.Value,
            Duration = audio.Duration
        };
        
        return await repo.CreateTrack(newTrack, genres);
    }
    
    public async Task<bool> AddToCollection(int trackId, int collectionId, IResolveFieldContext context)
    {
        var userId = context.GetUserId();
        
        return await repo.AddToCollection(trackId, collectionId, userId);
    }

    public async Task<bool> RemoveFromCollection(int trackId, int collectionId, IResolveFieldContext context)
    {
        var userId = context.GetUserId();
        
        return await repo.RemoveFromCollection(trackId, collectionId, userId);
    }
}
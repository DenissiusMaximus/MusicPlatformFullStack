using GraphQL;
using GraphQL.Server.Transports.AspNetCore;
using MusicPlatform.Dto;
using MusicPlatform.Models;
using MusicPlatform.Repositories;
using MusicPlatform.Services;

namespace MusicPlatform.Gql.Mutation;

public class CollectionMutation(ICollectionRepo repo, FileService fileService)
{
    public async Task<int?> CreateCollection(IResolveFieldContext context, string name, DateTime? createdAt, CollectionType type = CollectionType.Playlist, bool isPublic = true, string? description = null, [MediaType("image/png")] IFormFile? icon = null)
    {
        string? iconLink = null;
        
        if (icon != null)
            iconLink = (await fileService.SaveFileAsync(icon, "icons")).Url;
        
        var userId = context.GetUserId();
        
        createdAt ??= DateTime.UtcNow;
        if (createdAt > DateTime.UtcNow)
            return null;
        
        if(type == CollectionType.Album && !isPublic)
            return null;
        
        var newCollection = new Collection
        {
            UserId = userId,
            Name = name, 
            IsPublic = isPublic,
            CreatedAt = createdAt.Value,
            Description = description,
            Type = (int)type,
            IconLink = iconLink
        };

        return await repo.CreateCollection(newCollection);
    }

    public async Task<bool?> EditCollection(int collectionId, string? name, string? description, bool? isPublic, IResolveFieldContext context)
    {
        var currentUserId = context.GetUserId();

        var collection = new Collection
        {
            CollectionId = collectionId
        };

        if(name != null) collection.Name = name;
        if(description != null) collection.Description = description;
        if(isPublic != null) collection.IsPublic = isPublic.Value;
        
        var res = await repo.EditCollection(collection, currentUserId);

        return res;
    }

    
    public async Task<int?> CreateAlbum(
        IResolveFieldContext context, 
        string name, DateTime? createdAt, CollectionType type, 
        List<TrackInputDto>? tracks,
        bool isPublic = true, 
        string? description = null, 
        [MediaType("image/png")] IFormFile? icon = null
        )
    {
        string? iconLink = null;
        
        if (icon != null)
            iconLink = (await fileService.SaveFileAsync(icon, "icons")).Url;
        
        var userId = context.GetUserId();
        
        createdAt ??= DateTime.UtcNow;
        if (createdAt > DateTime.UtcNow)
            return null;
        
        if(type == CollectionType.Album && !isPublic)
            return null;
        
        var newCollection = new Collection
        {
            UserId = userId,
            Name = name, 
            IsPublic = isPublic,
            CreatedAt = createdAt.Value,
            Description = description,
            Type = (int)type,
            IconLink = iconLink
        };

        List<AlbumTrack> trackList = [];

        if (tracks != null)
        {
            foreach (var t in tracks)
            {
                var audio = (await fileService.SaveFileAsync(t.AudioFile, "audio"));
        
                trackList.Add(new AlbumTrack
                {
                    Name = t.Name, 
                    Description = t.Description, 
                    IsExplicit = t.IsExplicit, 
                    TrackLink = audio.Url,
                    IconLink = iconLink,
                    Duration = audio.Duration,
                    Genres = t.Genres
                });
            }
        }

        return await repo.CreateAlbumWithTracks(newCollection, trackList);
    }
    
    public async Task<bool> DeleteCollection(IResolveFieldContext context, int collectionId)
    {
        var userId = context.GetUserId();
        return await repo.DeleteCollection(collectionId, userId);
    }
}
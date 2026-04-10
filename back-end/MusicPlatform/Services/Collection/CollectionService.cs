using GraphQL;
using MusicPlatform.Models;
using MusicPlatform.Repositories;
using MusicPlatform.Services;

namespace MusicPlatform.Gql.Mutation;

public class CollectionService(
    ICollectionRepo collectionRepo,
    IFileProvider fileProvider,
    IResolveFieldContext context) : ICollectionService
{
    public async Task<int?> CreateCollection(
        CreateCollectionInput input)
    {
        string? iconLink = null;

        if (input.Icon != null)
            iconLink = (await fileProvider.SaveFileAsync(input.Icon, "icons")).Url;

        var userId = context.GetUserId();

        input.CreatedAt ??= DateTime.UtcNow;
        if (input.CreatedAt > DateTime.UtcNow)
            return null;

        if (input.Type == CollectionType.Album && !input.IsPublic)
            return null;

        var newCollection = new Collection
        {
            UserId = userId,
            Name = input.Name,
            IsPublic = input.IsPublic,
            CreatedAt = input.CreatedAt.Value,
            Description = input.Description,
            Type = (int)input.Type,
            IconLink = iconLink
        };

        return await collectionRepo.CreateCollection(newCollection);
    }

    public async Task<bool?> EditCollection(int collectionId, string? name, string? description, bool? isPublic)
    {
        var currentUserId = context.GetUserId();

        var collection = new Collection
        {
            CollectionId = collectionId
        };

        if (name != null) collection.Name = name;
        if (description != null) collection.Description = description;
        if (isPublic != null) collection.IsPublic = isPublic.Value;

        var res = await collectionRepo.EditCollection(collection, currentUserId);

        return res;
    }

    public async Task<int?> CreateAlbum(CreateAlbumInput input)
    {
        string? iconLink = null;

        if (input.Icon != null)
            iconLink = (await fileProvider.SaveFileAsync(input.Icon, "icons")).Url;

        var userId = context.GetUserId();

        input.CreatedAt ??= DateTime.UtcNow;
        if (input.CreatedAt > DateTime.UtcNow)
            return null;

        if (input.Type == CollectionType.Album && !input.IsPublic)
            return null;

        var newCollection = new Collection
        {
            UserId = userId,
            Name = input.Name,
            IsPublic = input.IsPublic,
            CreatedAt = input.CreatedAt.Value,
            Description = input.Description,
            Type = (int)input.Type,
            IconLink = iconLink
        };

        List<AlbumTrack> trackList = [];

        if (input.Tracks != null)
        {
            foreach (var t in input.Tracks)
            {
                var audio = await fileProvider.SaveFileAsync(t.AudioFile, "audio");

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

        return await collectionRepo.CreateAlbumWithTracks(newCollection, trackList);
    }

    public async Task<bool> DeleteCollection(int collectionId)
    {
        var userId = context.GetUserId();
        return await collectionRepo.DeleteCollection(collectionId, userId);
    }
}
using GraphQL;
using MusicPlatform.Repositories;
using MusicPlatform.Services;

namespace MusicPlatform.Gql.Mutation;

public class CollectionMutation(ICollectionService collectionService)
{
    public async Task<int?> CreateCollection(CreateCollectionInput input)
    {
        return await collectionService.CreateCollection(input);
    }

    public async Task<bool?> EditCollection(int collectionId, string? name, string? description, bool? isPublic)
    {
        return await collectionService.EditCollection(collectionId, name, description, isPublic);
    }


    public async Task<int?> CreateAlbum()
    {
        return await collectionService.CreateAlbum(new CreateAlbumInput());
    }

    public async Task<bool> DeleteCollection(IResolveFieldContext context, int collectionId)
    {
        return await collectionService.DeleteCollection(collectionId);
    }
}
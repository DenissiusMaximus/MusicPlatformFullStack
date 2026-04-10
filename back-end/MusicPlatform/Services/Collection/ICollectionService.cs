namespace MusicPlatform.Gql.Mutation;

public interface ICollectionService
{
    Task<int?> CreateCollection(
        CreateCollectionInput input);

    Task<bool?> EditCollection(int collectionId, string? name, string? description, bool? isPublic);
    Task<int?> CreateAlbum(CreateAlbumInput input);
    Task<bool> DeleteCollection(int collectionId);
}
using MusicPlatform.Dto;
using MusicPlatform.Models;

namespace MusicPlatform.Repositories;

public interface ICollectionRepo
{
    Task<CollectionDto?> GetCollectionById(int collectionId, int currentUserId);
    Task<IEnumerable<Collection>> GetCollectionViewByUserId(int userId);
    Task<bool?> EditCollection(Collection collection, int currentUserId);
    Task<bool?> ChekCollectionOwner(int collectionId, int currentUserId);
    Task<IEnumerable<CollectionDto>?> GetCollectionByUserId(int userId);
    Task<int?> CreateCollection(Collection collection);
    Task<bool> DeleteCollection(int collectionId, int currentUserId);
    Task<int?> CreateAlbumWithTracks(Collection collection, List<AlbumTrack> tracks);
}
using MusicPlatform.Dto;

namespace MusicPlatform.Repositories.Track;

public interface ITrackRepo
{
    Task<TrackDto?> GetById(int id);
    Task<IEnumerable<TrackDto>?> GetByUserId(int id);
    Task<bool> AddToCollection(int trackId, int collectionId, int currentUserId);
    Task<bool> RemoveFromCollection(int trackId, int collectionId, int currentUserId);
    Task<int?> CreateTrack(Models.Track track, List<int>? genres);
    Task<bool> DeleteTrack(int trackId, int currentUserId);
    Task<bool?> ChekTrackOwner(int trackId, int currentUserId);
}
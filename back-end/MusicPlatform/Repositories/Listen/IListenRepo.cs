using MusicPlatform.Dto;

namespace MusicPlatform.Repositories.Listen;

public interface IListenRepo
{
    Task<bool> AddListen(int userId, int trackId, DateTime date);
    Task<IEnumerable<Top10TracksDto>> GetTracksTop();
}
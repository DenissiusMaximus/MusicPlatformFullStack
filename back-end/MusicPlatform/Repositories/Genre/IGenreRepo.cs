namespace MusicPlatform.Repositories.Genre;

public interface IGenreRepo
{
    Task<IEnumerable<Models.Genre>> GetGenres();
    Task<bool> CreateGenre(string name);
    Task<bool> DeleteGenre(int genreId);
    Task<bool> SetToTrack(int trackId, List<int> genres, int currentUserId);
}
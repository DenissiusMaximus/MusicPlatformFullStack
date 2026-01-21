using System.Data;
using Dapper;
using MusicPlatform.DataAccess;

namespace MusicPlatform.Repositories.Genre;

public class GenreRepo(IDbConnectionFactory dbFactory) : IGenreRepo
{
    public async Task<IEnumerable<Models.Genre>> GetGenres()
    {
        var sql = "select * from Genres";

        var conn = dbFactory.CreateConnection();

        return await conn.QueryAsync<Models.Genre>(sql);
    }

    public async Task<bool> CreateGenre(string name)
    {
        var sql = "INSERT INTO Genres (Name) VALUES (@Name)";

        using var conn = dbFactory.CreateConnection();

        return await conn.ExecuteAsync(sql, new { Name = name }) > 0;
    }

    public async Task<bool> DeleteGenre(int genreId)
    {
        var sql = "DELETE FROM Genres WHERE GenreId = @GenreId";

        using var conn = dbFactory.CreateConnection();

        return await conn.ExecuteAsync(sql, new { genreId }) > 0;
    }

    public async Task<bool> SetToTrack(int trackId, List<int> genres, int currentUserId)
    {
        var jsonGenres = System.Text.Json.JsonSerializer.Serialize(genres);

        var spName = "UpdateTrackGenres";

        using var conn = dbFactory.CreateConnection();

        try
        {
            var res = await conn.ExecuteAsync(spName,
                new { TrackId = trackId, GenreIdsJson = jsonGenres, CurrentUserId = currentUserId },
                commandType: CommandType.StoredProcedure);
            
            return true;
        }
        catch (Exception e)
        {
            return false;
        }
    }
}
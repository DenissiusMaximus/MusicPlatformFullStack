using Dapper;
using MusicPlatform.DataAccess;
using MusicPlatform.Dto;

namespace MusicPlatform.Repositories.Listen;

public class ListenRepo(IDbConnectionFactory dbFactory) : IListenRepo
{
    public async Task<bool> AddListen(int userId, int trackId, DateTime date)
    {
        var sql = @"INSERT INTO MusicPlatform.dbo.Listens (UserId, TrackId, Date) VALUES (@UserId, @TrackId, @Date)";

        var conn = dbFactory.CreateConnection();
        
        return await conn.ExecuteAsync(sql, new { UserId = userId, TrackId = trackId, Date = date }) > 0;
    }

    public async Task<IEnumerable<Top10TracksDto>> GetTracksTop()
    {
        var sql = "SELECT * FROM vw_Top10TracksLastMonth";
    
        using var conn = dbFactory.CreateConnection();
    
        return await conn.QueryAsync<Top10TracksDto>(sql);
    }
}
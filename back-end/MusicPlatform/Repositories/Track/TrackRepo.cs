using System.Data;
using System.Text.Json;
using Dapper;
using Microsoft.Data.SqlClient;
using MusicPlatform.DataAccess;
using MusicPlatform.Dto;

namespace MusicPlatform.Repositories.Track;

public class TrackRepo(IDbConnectionFactory dbFactory) : ITrackRepo
{
    public async Task<TrackDto?> GetById(int id)
    {
        using var conn = dbFactory.CreateConnection();

        var spName = "GetTrackDetailsById";
        var result = await conn.QueryFirstOrDefaultAsync<TrackDto>(spName, new { TrackId = id }, commandType: CommandType.StoredProcedure);

        return result;  
    }

    public async Task<IEnumerable<TrackDto>?> GetByUserId(int id)
    {
        var spName = "GetTrackDetailsByUserId";
        
        using var conn = dbFactory.CreateConnection();
        return await conn.QueryAsync<TrackDto>(spName, new { UserId = id }, commandType: CommandType.StoredProcedure);
    }

    public async Task<int?> CreateTrack(Models.Track track, List<int>? genres)
    {
        var sqlCreateTrack = @"INSERT INTO MusicPlatform.dbo.Tracks 
                           (UserId, Name, Description, ReleaseDate, IsExplicit, Duration, IconLink, TrackLink) 
                           VALUES (@UserId, @Name, @Description, @ReleaseDate, @IsExplicit, @Duration, @IconLink, @TrackLink);
                           SELECT CAST(SCOPE_IDENTITY() as int);";

        using var conn = dbFactory.CreateConnection();

        using var transaction = conn.BeginTransaction();

        try
        {
            var trackId = await conn.ExecuteScalarAsync<int?>(sqlCreateTrack, track, transaction);

            if (trackId.HasValue && genres != null && genres.Count > 0)
            {
                var jsonGenres = JsonSerializer.Serialize(genres);

                await conn.ExecuteAsync(
                    "UpdateTrackGenres", 
                    new 
                    { 
                        TrackId = trackId.Value, 
                        GenreIdsJson = jsonGenres, 
                        CurrentUserId = track.UserId 
                    },
                    transaction,
                    commandType: CommandType.StoredProcedure 
                );
            }

            transaction.Commit();
            return trackId;
        }
        catch
        {
            transaction.Rollback();
            throw;
        }
    }

    public async Task<bool?> ChekTrackOwner(int trackId, int currentUserId)
    {
        var sql =
            "SELECT * FROM Tracks WHERE TrackId = @trackId AND UserId = @currentUserId";

        using var db = dbFactory.CreateConnection();
        return await db.QueryFirstOrDefaultAsync<Models.Track>(sql, new { trackId, currentUserId }) != null;
    }
    
    public async Task<bool> DeleteTrack(int trackId, int currentUserId)
    {
        const string spName = "DeleteTrack";
        using var conn = dbFactory.CreateConnection();
        
        try 
        {
            await conn.ExecuteAsync(spName, new { TrackId = trackId, @CurrentUserId = currentUserId }, commandType: CommandType.StoredProcedure);
    
            return true;
        }
        catch (SqlException ex)
        {
            if (ex.Number is 50001 or 50003)
                return false;
            
            throw;
        }
    }

    public async Task<bool> AddToCollection(int trackId, int collectionId, int currentUserId)
    {
        using var conn = dbFactory.CreateConnection();
        var spName = "AddTrackToCollection"; 

        try 
        {
            await conn.ExecuteAsync(spName, new { TrackId = trackId, CollectionId = collectionId, UserId = currentUserId }, commandType: CommandType.StoredProcedure);
    
            return true; 
        }
        catch (SqlException ex)
        {
            if (ex.Number is 50002 or 50000)
                return false;
            
            throw;
        }
    }

    public async Task<bool> RemoveFromCollection(int trackId, int collectionId, int currentUserId)
    {
        using var conn = dbFactory.CreateConnection();

        try 
        {
            var spName = "RemoveTrackFromCollection"; 
    
            await conn.ExecuteAsync(
                spName, 
                new { TrackId = trackId, CollectionId = collectionId, UserId = currentUserId }, 
                commandType: CommandType.StoredProcedure);
    
            return true; 
        }
        catch (SqlException ex)
        {
            if (ex.Number is 50002 or 50001 or 50004)
                return false;
            
            throw;
        }
    }
}
using System.Data;
using Dapper;
using MusicPlatform.DataAccess;
using MusicPlatform.Dto;

namespace MusicPlatform.Repositories;

public class SearchRepo(IDbConnectionFactory dbFactory) : ISearchRepo
{
    public async Task<SearchDto> Search(string query, int currentUserId)
    {
        const string spName = "GlobalSearch";
        var result = new SearchDto();
        
        using var conn = dbFactory.CreateConnection();
        var multi = await conn.QueryMultipleAsync(
            spName, 
            new { Query = query, CurrentUserId = currentUserId }, 
            commandType: CommandType.StoredProcedure
        );
        
        result.Tracks = (await multi.ReadAsync<TrackDto>()).ToList();
        result.Artists = (await multi.ReadAsync<ArtistsDto>()).ToList();
        result.Collections = (await multi.ReadAsync<CollectionDto>()).ToList();
        
        return result;
    }
    
}
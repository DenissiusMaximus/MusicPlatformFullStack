using System.Data;
using System.Text.Json;
using Dapper;
using MusicPlatform.DataAccess;
using MusicPlatform.Dto;
using MusicPlatform.Models;

namespace MusicPlatform.Repositories;

public class CollectionRepo(IDbConnectionFactory dbFactory) : ICollectionRepo
{
    private static CollectionDto CollectionSongMapper(CollectionDto collection, TrackDto track,
        Dictionary<int, CollectionDto> collectionDict)
    {
        if (!collectionDict.TryGetValue(collection.CollectionId, out var currentCollection))
        {
            currentCollection = collection;
            currentCollection.Songs = new List<TrackDto>();
            collectionDict.Add(currentCollection.CollectionId, currentCollection);
        }

        if (track is not null && track.TrackId != 0)
        {
            currentCollection.Songs.Add(track);
        }

        return currentCollection;
    }

    public async Task<bool?> EditCollection(Collection collection, int currentUserId)
    {
        var sql =
            "UPDATE Collections SET Name = @Name, Description = @Description, IsPublic = @IsPublic WHERE CollectionId = @CollectionId AND UserId = @currentUserId AND Type = 1";

        using var db = dbFactory.CreateConnection();
        return await db.ExecuteAsync(sql, new
        {
            Name = collection.Name,
            Description = collection.Description,
            IsPublic = collection.IsPublic,
            CollectionId = collection.CollectionId,
            currentUserId = currentUserId
        }) > 0;
    }

    public async Task<bool?> ChekCollectionOwner(int collectionId, int currentUserId)
    {
        var sql =
            "SELECT * FROM Collections WHERE CollectionId = @collectionId AND UserId = @currentUserId";

        using var db = dbFactory.CreateConnection();
        return await db.QueryFirstOrDefaultAsync<Collection>(sql, new { collectionId, currentUserId }) != null;
    }

    public async Task<CollectionDto?> GetCollectionById(int collectionId, int currentUserId)
    {
        const string spName = "GetCollectionDetails";

        var collectionDict = new Dictionary<int, CollectionDto>();

        using var db = dbFactory.CreateConnection();
        var res = await db.QueryAsync<CollectionDto, TrackDto, CollectionDto>(spName,
            (collection, track) =>
                CollectionSongMapper(collection, track, collectionDict),
            new { CollectionId = collectionId, CurrentUserId = currentUserId },
            splitOn: "TrackId",
            commandType: CommandType.StoredProcedure
        );

        return collectionDict.Values.FirstOrDefault();
    }

    public async Task<IEnumerable<Collection>> GetCollectionViewByUserId(int userId)
    {
        const string sql = @"SELECT * FROM Collections WHERE UserId = @userId";

        using var db = dbFactory.CreateConnection();
        return await db.QueryAsync<Collection>(sql, new { userId });
    }

    public async Task<IEnumerable<CollectionDto>?> GetCollectionByUserId(int userId)
    {
        const string spName = "GetUserCollections";

        var collectionDict = new Dictionary<int, CollectionDto>();

        using var conn = dbFactory.CreateConnection();
        var res = await conn.QueryAsync<CollectionDto, TrackDto, CollectionDto>(spName,
            (collection, track) =>
                CollectionSongMapper(collection, track, collectionDict),
            new { @UserId = userId },
            splitOn: "TrackId",
            commandType: CommandType.StoredProcedure
        );

        return collectionDict.Values;
    }

    public async Task<int?> CreateCollection(Collection collection)
    {
        const string sql =
            @"INSERT INTO Collections (UserId, Name, Description, Type, CreatedAt, iconLink, AverageRating, isPublic) VALUES (@UserId, @Name, @Description, @Type, @CreatedAt, @iconLink, @AverageRating, @isPublic)
         SELECT CAST(SCOPE_IDENTITY() as int)";

        using var conn = dbFactory.CreateConnection();
        return await conn.ExecuteScalarAsync<int?>(sql, collection);
    }


    public async Task<int?> CreateAlbumWithTracks(Collection collection, List<AlbumTrack> tracks)
    {
        using var conn = dbFactory.CreateConnection();

        tracks.ForEach(t =>
        {
            t.IconLink = collection.IconLink;
            t.ReleaseDate = collection.CreatedAt;
            t.UserId = collection.UserId;
        });

        using var transaction = conn.BeginTransaction();

        try
        {
            var sqlCollection = @"
        INSERT INTO Collections (UserId, Name, Description, Type, CreatedAt, iconLink, isPublic) 
        VALUES (@UserId, @Name, @Description, 2, @CreatedAt, @iconLink, 1);
        SELECT CAST(SCOPE_IDENTITY() as int)";

            var collectionId = await conn.ExecuteScalarAsync<int>(sqlCollection, collection, transaction);

            if (tracks != null && tracks.Count > 0)
            {
                foreach (var t in tracks)
                {
                    var sqlTrack = @"
                INSERT INTO Tracks (UserId, Name, Description, ReleaseDate, IsExplicit, Duration, IconLink, TrackLink) 
                VALUES (@UserId, @Name, @Description, @ReleaseDate, @IsExplicit, @Duration, @IconLink, @TrackLink);
                SELECT CAST(SCOPE_IDENTITY() as int);";

                    var trackId = await conn.ExecuteScalarAsync<int>(sqlTrack, t, transaction);

                    var spAddTrackToCollection = "AddTrackToCollection";
                    await conn.ExecuteAsync(spAddTrackToCollection,
                        new { TrackId = trackId, CollectionId = collectionId, UserId = collection.UserId },
                        transaction,
                        commandType: CommandType.StoredProcedure);

                    if (t.Genres != null && t.Genres.Count > 0)
                    {
                        string jsonGenres = JsonSerializer.Serialize(t.Genres);

                        await conn.ExecuteAsync(
                            "UpdateTrackGenres", 
                            new
                            {
                                TrackId = trackId,
                                GenreIdsJson = jsonGenres,
                                CurrentUserId = collection.UserId
                            },
                            transaction,
                            commandType: CommandType.StoredProcedure
                        );
                    }
                }
            }

            transaction.Commit();
            return collectionId;
        }
        catch (Exception)
        {
            transaction.Rollback();
            throw;
        }
    }

    public async Task<bool> DeleteCollection(int collectionId, int currentUserId)
    {
        const string spName = @"DeleteCollection";

        var parameters = new
        {
            CollectionId = collectionId,
            CurrentUserId = currentUserId
        };

        using var db = dbFactory.CreateConnection();
        int rowsAffected = await db.ExecuteAsync(
            spName,
            parameters,
            commandType: CommandType.StoredProcedure
        );
        return rowsAffected > 0;
    }
}
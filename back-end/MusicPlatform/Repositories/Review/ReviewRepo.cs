using System.Data;
using Dapper;
using Microsoft.Data.SqlClient;
using MusicPlatform.DataAccess;

namespace MusicPlatform.Repositories.Review;

public class ReviewRepo(IDbConnectionFactory dbFactory) : IReviewRepo
{
    public async Task<IEnumerable<Models.ReviewDto>> GetForTrack(int trackId, int limit, int offset)
    {
        using var conn = dbFactory.CreateConnection();

        var sql = @"
                    SELECT 
                r.*, 
                u.login AS AuthorLogin
            FROM Reviews r
            JOIN Users u ON r.UserID = u.UserId
            WHERE r.TrackId = @trackId AND r.ReplyToReviewID IS NULL
            ORDER BY r.ReviewDate DESC
            OFFSET @offset ROWS
            FETCH NEXT @limit ROWS ONLY";

        return await conn.QueryAsync<Models.ReviewDto>(
            sql,
            new { trackId, limit, offset }
        );
    }

    public async Task<IEnumerable<Models.ReviewDto>> GetForCollection(int collectionId, int limit, int offset)
    {
        using var conn = dbFactory.CreateConnection();

        var sql = @"
            SELECT 
                r.*, 
                u.login AS AuthorLogin
            FROM Reviews r
            JOIN Users u ON r.UserID = u.UserId
            WHERE r.CollectionID = @collectionId AND r.ReplyToReviewID IS NULL
            ORDER BY r.ReviewDate DESC
            OFFSET @offset ROWS
            FETCH NEXT @limit ROWS ONLY";

        return await conn.QueryAsync<Models.ReviewDto>(
            sql,
            new { collectionId, limit, offset }
        );
    }

    public async Task<IEnumerable<Models.ReviewDto>> GetReplies(int parentReviewId, int limit, int offset)
    {
        using var conn = dbFactory.CreateConnection();

        var sql = @"
        SELECT * FROM Reviews
        WHERE ReplyToReviewID = @parentReviewId
        ORDER BY ReviewDate DESC
        OFFSET @offset ROWS
        FETCH NEXT @limit ROWS ONLY";

        return await conn.QueryAsync<Models.ReviewDto>(
            sql,
            new { parentReviewId, limit, offset }
        );
    }

    public async Task<int?> CreateReview(Models.Review reviewDto)
    {
        const string sql =
            @"INSERT INTO Reviews (CollectionID, TrackID, UserID, Rating, ReviewText, ReviewDate, ReplyToReviewID) VALUES (@CollectionID, @TrackID, @UserID, @Rating, @ReviewText, @ReviewDate, @ReplyToReviewID)
        SELECT CAST(SCOPE_IDENTITY() as int)";

        using var conn = dbFactory.CreateConnection();

        try
        {
            return await conn.ExecuteScalarAsync<int>(sql, reviewDto);
        }
        catch (SqlException e)
        {
            if (e.Number is 50000 or 547)
                return null;
            throw;
        }
    }

    public async Task<bool> DeleteReview(int reviewId, int currentUserId)
    {
        const string spName = "DeleteReview";
        using var conn = dbFactory.CreateConnection();

        try
        {
            return await conn.ExecuteAsync(
                spName,
                new { @ReviewId = reviewId, CurrentUserId = currentUserId },
                commandType: CommandType.StoredProcedure
            ) > 0;
        }
        catch (SqlException e)
        {
            if (e.Number is 50001 or 50002)
                return false;
            throw;
        }
    }

    public async Task<bool?> EditReview(int? rating, string? text, int reviewId, int currentUserId)
    {
        var sql = @"
        UPDATE Reviews 
        SET ReviewText = COALESCE(@text, ReviewText), 
            Rating = COALESCE(@rating, Rating)
        WHERE ReviewID = @reviewId AND UserID = @currentUserId";

        using var conn = dbFactory.CreateConnection();

        var rowsAffected = await conn.ExecuteAsync(sql, new { text, rating, reviewId, currentUserId });

        return rowsAffected > 0;
    }
}
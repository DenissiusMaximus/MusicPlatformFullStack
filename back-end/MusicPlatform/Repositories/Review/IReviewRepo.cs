namespace MusicPlatform.Repositories.Review;

public interface IReviewRepo
{
    Task<IEnumerable<Models.ReviewDto>> GetForTrack(int trackId, int limit, int offset);
    Task<IEnumerable<Models.ReviewDto>> GetForCollection(int collectionId, int limit, int offset);
    Task<IEnumerable<Models.ReviewDto>> GetReplies(int parentReviewId, int limit, int offset);
    Task<int?> CreateReview(Models.Review reviewDto);
    Task<bool> DeleteReview(int reviewId, int currentUserId);
    Task<bool?> EditReview(int? rating, string? text, int reviewId, int currentUserId);
}
using GraphQL;
using MusicPlatform.Models;
using MusicPlatform.Repositories.Review;

namespace MusicPlatform.Gql.Mutation;

public class ReviewsMutation(IReviewRepo repo)
{
    public async Task<int?> CreateReview(IResolveFieldContext context, ReviewType targetType, int targetId, string text, int? rating = null, DateTime? reviewDate = null)
    {
        var userId = context.GetUserId();
        
        var newReview = new Models.Review
        {
            UserID = userId,
            TrackID = targetType == ReviewType.Track ? targetId : null,
            CollectionID = targetType == ReviewType.Album ? targetId : null,
            ReplyToReviewID = targetType == ReviewType.ParentReview ? targetId : null,
            
            Rating = rating,
            ReviewText = text,
            ReviewDate = reviewDate ?? DateTime.Now
        };
        
        return await repo.CreateReview(newReview);
    }

    public async Task<bool?> EditReview(string? text, int? rating, int reviewId, IResolveFieldContext context)
    {
        var userId = context.GetUserId();
        
        return await repo.EditReview(rating, text, reviewId, userId);
    }
    

    public async Task<bool> DeleteReview(int reviewId, IResolveFieldContext context)
    {
        var userId = context.GetUserId();
        
        return await repo.DeleteReview(reviewId, userId);
    }
}
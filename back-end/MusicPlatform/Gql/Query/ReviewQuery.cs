using GraphQL;
using MusicPlatform.Models;
using MusicPlatform.Repositories.Review;

namespace MusicPlatform.Gql.Query;

public class ReviewQuery(IReviewRepo repo)
{
    public async Task<IEnumerable<ReviewDto>?> Reviews(IResolveFieldContext context, ReviewType targetType, int targetId, int limit = 10,
        int offset = 0)
    {
        var userId = context.GetUserId();

        IEnumerable<ReviewDto>? res;

        if (targetType == ReviewType.Track)
            res = await repo.GetForTrack(targetId, limit, offset);
        else
            res = await repo.GetForCollection(targetId, limit, offset);

        if (res.Count() <= 0) return null;
        foreach (var r in res)
        {
            if (r.UserID == userId)
                r.IsCurrentUserOwner = true;
            
        }

        return res;
    }

    public async Task<IEnumerable<ReviewDto>?> Replies(int parentReviewId, int limit = 10, int offset = 0)
    {
        return await repo.GetReplies(parentReviewId, limit, offset);
    }
}
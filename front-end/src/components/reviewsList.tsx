import {type CreateReviewInput, ReviewType} from "../types.ts";
import {useAppDispatch, useAppSelector} from "../hooks/redux.ts";
import {createReview, getReviews, selectReplies, selectReviews} from "../store/slices/review.ts";
import {useEffect, useState} from "react";
import {ReviewInput} from "./ReviewInput.tsx";
import {ReviewItem} from "./reviewItem.tsx";

export const ReviewsList = ({collectionId, type}: { collectionId: number, type: ReviewType }) => {
  const dispatch = useAppDispatch();
  const reviews = useAppSelector(selectReviews);
  const replies = useAppSelector(selectReplies);

  useEffect(() => {
    dispatch(getReviews({
      limit: 100,
      targetId: collectionId,
      targetType: type
    }));
  }, [collectionId, dispatch, type]);

  const handleCreateReview = (text: string, rating: number | null) => {
    const createReviewPayload: CreateReviewInput = {
      text: text,
      rating: rating,
      targetType: type,
      targetId: collectionId,
      reviewDate: new Date(Date.now()).toISOString()
    }

    dispatch(createReview(createReviewPayload));
    dispatch(getReviews({
      limit: 100,
      targetId: collectionId,
      targetType: type
    }));
    setHasUserReview(true);
  };

  const [hasUserReview, setHasUserReview] = useState(reviews?.some(r => r.isCurrentUserOwner && r.replyToReviewID === null));

  const sortedReviews = reviews
      ? [...reviews]
          .filter(r => r.replyToReviewID === null)
          .sort((a, b) => Number(b.isCurrentUserOwner || 0) - Number(a.isCurrentUserOwner || 0))
      : [];

  return (
      <div className="w-full flex flex-col gap-6">
        <div className="text-[#7A7A7A] text-xl">Відгуки</div>

        {!hasUserReview && (
            <ReviewInput onSubmit={handleCreateReview}/>
        )}

        <div className="flex flex-col gap-6">
          {sortedReviews.map((review) => (
              <ReviewItem
                  key={review.reviewID}
                  review={review}
                  repliesMap={replies}
                  parentContext={{id: collectionId, type: type}}
              />
          ))}

          {(!sortedReviews || sortedReviews.length === 0) && (
              <div className="text-center text-gray-400 mt-4">Поки немає відгуків. Будьте першим!</div>
          )}
        </div>
      </div>
  );
};
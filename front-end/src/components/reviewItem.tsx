import {type CreateReviewInput, type EditReviewInput, type Review, ReviewType} from "../types.ts";
import {useAppDispatch} from "../hooks/redux.ts";
import {useState} from "react";
import {createReview, deleteReview, editReview, getReplies, getReviews} from "../store/slices/review.ts";
import {ReviewInput} from "./ReviewInput.tsx";
import Star from "../assets/Star.svg?react";

export const ReviewItem = ({review, repliesMap, parentContext}: {
  review: Review,
  repliesMap: { [key: number]: Review[] } | null,
  parentContext: { id: number, type: ReviewType }
}) => {
  const dispatch = useAppDispatch();

  const [isEditing, setIsEditing] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [showReplies, setShowReplies] = useState(false);

  const reviewReplies = repliesMap ? repliesMap[review.reviewID] : null;

  const handleShowReplies = () => {
    if (!showReplies && !reviewReplies) {
      dispatch(getReplies({parentReviewId: review.reviewID}));
    }
    setShowReplies(!showReplies);
  };

  const handleEditSubmit = (text: string, rating: number | null) => {
    const editReviewPayload: EditReviewInput = {
      reviewId: review.reviewID,
      text: text,
      rating: rating,
    }

    dispatch(editReview(editReviewPayload));

    dispatch(getReviews({
      limit: 100,
      targetId: parentContext.id,
      targetType: parentContext.type
    }));

    setIsEditing(false);
  };

  const handleDelete = () => {
    if (confirm("Ви впевнені, що хочете видалити цей коментар?")) {
      dispatch(deleteReview(review.reviewID));

      dispatch(getReviews({
        limit: 100,
        targetId: parentContext.id,
        targetType: parentContext.type
      }));
    }
  };

  const handleReplySubmit = (text: string, _rating: number | null) => {
    const createReviewInput: CreateReviewInput = {
      text: text,
      rating: null,
      targetId: review.reviewID,
      targetType: ReviewType.ParentReview,
      reviewDate: new Date(Date.now()).toISOString(),
    }

    dispatch(createReview(createReviewInput));

    setIsReplying(false);
  };

  if (isEditing) {
    return (
        <ReviewInput
            initialText={review.reviewText || ""}
            initialRating={review.rating}
            onSubmit={handleEditSubmit}
            onCancel={() => setIsEditing(false)}
            onDelete={handleDelete}
            submitLabel="Зберегти"
        />
    );
  }

  return (
      <div className="flex flex-col w-full border-b border-gray-100 pb-4 last:border-0">
        <div className="flex flex-row justify-between items-start">
          <div className="text-xl font-medium text-[#0F0F0F]">
            {review.authorLogin || `User ${review.userID}`}
            {review.isCurrentUserOwner && " (Ви)"}
          </div>

          <div className="flex gap-4">
            {review.isCurrentUserOwner && (
                <button
                    onClick={() => setIsEditing(true)}
                    className="text-sm text-gray-400 hover:text-black transition-colors"
                >
                  Редагувати
                </button>
            )}

            {review.rating && (
                <div className="flex items-center gap-1">
                  <span className="text-xl font-medium">{review.rating}</span>
                  <span className="text-xl text-[#7A7A7A]">/10</span>
                  <Star className="w-5 h-5 mb-1"/>
                </div>
            )}
          </div>
        </div>

        <div className="text-[#7A7A7A] text-lg mt-1 mb-2">
          {review.reviewText}
        </div>

        <div className="flex justify-start gap-4 items-center">
          <button
              onClick={handleShowReplies}
              className="text-[#0F0F0F] text-sm font-medium hover:underline"
          >
            {showReplies ? "Приховати відповіді" : "Показати відповіді"}
          </button>

          <button
              onClick={() => setIsReplying(!isReplying)}
              className="text-[#7A7A7A] text-sm hover:text-black"
          >
            Відповісти
          </button>
        </div>

        {isReplying && (
            <div className="ml-8 mt-2">
              <ReviewInput
                  isReply={true}
                  onSubmit={handleReplySubmit}
                  onCancel={() => setIsReplying(false)}
              />
            </div>
        )}

        {showReplies && reviewReplies && (
            <div className="flex flex-col gap-4 mt-4 ml-8 pl-4 border-l-2 border-gray-100">
              {reviewReplies.map(reply => (
                  <ReviewItem
                      key={reply.reviewID}
                      review={reply}
                      repliesMap={repliesMap}
                      parentContext={parentContext}
                  />
              ))}
              {reviewReplies.length === 0 && (
                  <div className="text-gray-400 text-sm">Немає відповідей</div>
              )}
            </div>
        )}
      </div>
  );
};
import type {AppEpic} from "../store.ts";
import {catchError, from, map, mergeMap, of, switchMap} from "rxjs";
import {combineEpics, ofType} from "redux-observable";
import {
  createReview, createReviewFulfilled, createReviewRejected,
  deleteReview, deleteReviewFulfilled, deleteReviewRejected, editReview, editReviewFulfilled, editReviewRejected,
  getReplies,
  getRepliesFulfilled, getRepliesRejected,
  getReviews,
  getReviewsFulfilled,
  getReviewsRejected
} from "../slices/review.ts";
import ReviewRepository from "../../repositories/ReviewRepository.ts";
import {type GetReviewsInput, type Review, ReviewType} from "../../types.ts";
import {getById} from "../slices/track.ts";
import {getCollection} from "../slices/collection.ts";

export const getReviewEpic: AppEpic = (action$) =>
    action$.pipe(
        ofType(getReviews.type),
        switchMap((action) =>
            from(ReviewRepository.getReviews(action.payload)).pipe(
                map((data) => {
                  const result = data.review.reviews
                  if (result == null) {
                    return getReviewsRejected("Помилка отримання відгуків")
                  }

                  return getReviewsFulfilled(result);
                }),
                catchError((err) => of(getReviewsRejected(err.message)))
            )
        )
    );

export const getRepliesEpic: AppEpic = (action$) =>
    action$.pipe(
        ofType(getReplies.type),
        switchMap((action) =>
            from(ReviewRepository.getReplies(action.payload)).pipe(
                map((data) => {
                  const result = data.review.replies

                  if (result[0].replyToReviewID !== null) {
                    const payload: { reviewId: number, reviews: Review[] } = {
                      reviewId: result[0].replyToReviewID,
                      reviews: result
                    }
                    return getRepliesFulfilled(payload);
                  }

                    return getRepliesRejected("Помилка отримання відгуків")
                }),
                catchError((err) => of(getRepliesRejected(err.message)))
            )
        )
    );

export const createReviewEpic: AppEpic = (action$) =>
    action$.pipe(
        ofType(createReview.type),
        switchMap((action) =>
            from(ReviewRepository.createReview(action.payload)).pipe(
                mergeMap((data) => {
                  const result = data.review.createReview

                  if (result === null) {
                    return of(createReviewRejected("Помилка створення відгуків"));
                  }

                  let refreshAction1;
                  if (action.payload.targetType === ReviewType.Track) {
                    refreshAction1 = getById(action.payload.targetId);
                  } else {
                    refreshAction1 = getCollection(action.payload.targetId);
                  }

                  let refreshAction2;
                  if (action.payload.targetType === ReviewType.Track) {
                    const getReviewsPayload: GetReviewsInput = {
                      targetId: action.payload.targetId,
                      targetType: ReviewType.Track
                    }
                    refreshAction2 = getReviews(getReviewsPayload);
                  } else {
                    const getReviewsPayload: GetReviewsInput = {
                      targetId: action.payload.targetId,
                      targetType: ReviewType.Album
                    }

                    refreshAction2 = getReviews(getReviewsPayload);
                  }


                  return of(createReviewFulfilled(result), refreshAction1, refreshAction2);
                }),
                catchError((err) => of(getRepliesRejected(err.message)))
            )
        )
    );

export const editReviewEpic: AppEpic = (action$) =>
    action$.pipe(
        ofType(editReview.type),
        switchMap((action) =>
            from(ReviewRepository.editReview(action.payload)).pipe(
                map((data) => {
                  const result = data.review.editReview

                  if (result === null) {
                    return editReviewRejected("Помилка редагування відгука")
                  }

                  return editReviewFulfilled(result);
                }),
                catchError((err) => of(editReviewRejected(err.message)))
            )
        )
    );

export const deleteReviewEpic: AppEpic = (action$) =>
    action$.pipe(
        ofType(deleteReview.type),
        switchMap((action) =>
            from(ReviewRepository.deleteReview(action.payload)).pipe(
                map((data) => {
                  const result = data.review.deleteReview

                  if (result === null) {
                    return deleteReviewRejected("Помилка видалення відгука")
                  }

                  return deleteReviewFulfilled(result);
                }),
                catchError((err) => of(deleteReviewRejected(err.message)))
            )
        )
    );


export default combineEpics(getReviewEpic, getRepliesEpic, createReviewEpic, editReviewEpic, deleteReviewEpic);
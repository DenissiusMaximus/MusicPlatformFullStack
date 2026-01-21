import {createSlice, type PayloadAction} from "@reduxjs/toolkit";
import type {
  BaseState, CreateReviewInput, EditReviewInput, GetRepliesInput,
  GetReviewsInput,
  Review
} from "../../types.ts";

interface ReviewState extends BaseState {
  reviews: Review[] | null;
  replies: { [key: number]: Review[] } | null;
}

const initialState: ReviewState = {
  reviews: null,
  loading: false,
  error: null,
  replies: null
}

const reviewSlice = createSlice({
  name: 'review',
  initialState,
  reducers: {
    getReviews(state, _action: PayloadAction<GetReviewsInput>) {
      state.loading = true;
    },
    getReviewsFulfilled(state, action: PayloadAction<Review[] | null>) {
      state.reviews = action.payload;
      state.loading = false;
    },
    getReviewsRejected(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    getReplies(state, _action: PayloadAction<GetRepliesInput>) {
      state.loading = true;
    },
    getRepliesFulfilled(state, action: PayloadAction<{ reviewId: number, reviews: Review[] }>) {
      state.replies = {...state.replies, [action.payload.reviewId]: action.payload.reviews}
      state.loading = false;
    },
    getRepliesRejected(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    createReview(state, _action: PayloadAction<CreateReviewInput>) {
      state.loading = true;
    },
    createReviewFulfilled(state, _action: PayloadAction<boolean>) {
      state.loading = false;
    },
    createReviewRejected(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    editReview(state, _action: PayloadAction<EditReviewInput>) {
      state.loading = true;
      state.error = null;
    },
    editReviewFulfilled(state, _action: PayloadAction<boolean>) {
      state.loading = false;
    },
    editReviewRejected(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    deleteReview(state, _action: PayloadAction<number>) {
      state.loading = true;
      state.error = null;
    },
    deleteReviewFulfilled(state, _action: PayloadAction<boolean>) {
      state.loading = false;
    },
    deleteReviewRejected(state, _action: PayloadAction<string>) {
      state.loading = false;
    }
  },
});

export const {
  getReviews,
  getReviewsFulfilled,
  getReviewsRejected,
  getReplies,
  getRepliesFulfilled,
  getRepliesRejected,
  createReview,
  createReviewFulfilled,
  createReviewRejected,
  editReview,
  editReviewFulfilled,
  editReviewRejected,
  deleteReview,
  deleteReviewFulfilled,
  deleteReviewRejected
} = reviewSlice.actions;

export const selectReviews = (state: { review: ReviewState }) => state.review.reviews;
export const selectReplies = (state: { review: ReviewState }) => state.review.replies;

export type ReviewAction = ReturnType<
    (typeof reviewSlice.actions)[keyof typeof reviewSlice.actions]
>;

export default reviewSlice.reducer;

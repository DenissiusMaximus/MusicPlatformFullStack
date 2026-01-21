import type {
  GetRepliesGraphqlResponse, GetRepliesInput, GetReviewsGraphqlResponse, GetReviewsInput,
  DeleteReviewGraphqlResponse, CreateReviewGraphqlResponse, CreateReviewInput, EditReviewInput,
  EditReviewGraphqlResponse
} from "../types.ts";
import {axiosGraph} from "../utils/axios.ts";
import {
  CREATE_REVIEW_MUTATION,
  DELETE_REVIEW_MUTATION,
  EDIT_REVIEW_MUTATION,
  GET_REPLIES_QUERY,
  GET_REVIEWS_QUERY
} from "../Queries.ts";

export class ReviewRepository {
  async getReviews(input: GetReviewsInput){
    return await axiosGraph<GetReviewsGraphqlResponse>(GET_REVIEWS_QUERY, input)
  }

  async getReplies(input: GetRepliesInput){
    return await axiosGraph<GetRepliesGraphqlResponse>(GET_REPLIES_QUERY, input)
  }

  async deleteReview(input: number){
    return await axiosGraph<DeleteReviewGraphqlResponse>(DELETE_REVIEW_MUTATION, {id: input})
  }

  async createReview(input: CreateReviewInput){
    return await axiosGraph<CreateReviewGraphqlResponse>(CREATE_REVIEW_MUTATION, input)
  }

  async editReview(input: EditReviewInput){
    return await axiosGraph<EditReviewGraphqlResponse>(EDIT_REVIEW_MUTATION, input)
  }
}

export default new ReviewRepository();
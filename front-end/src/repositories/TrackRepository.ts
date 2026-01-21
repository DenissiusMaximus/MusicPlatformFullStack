import axiosInstance, {axiosGraph} from "../utils/axios.ts";
import type {
  AddTrackToCollectionInput,
  AddTrackToCollectionTGraphqlResponse,
  GetSingleGraphqlResponse,
  RemoveTrackFromCollectionInput,
  RemoveTrackFromCollectionGraphqlResponse,
  RemoveTrackGraphqlResponse,
  CreateTrackInput,
  GetByUserGraphqlResponse, CanEditTrackGraphqlResponse, GetGenresGraphqlResponse, SetGenresGraphqlResponse,
  SetGenresInput, CreateTrackGraphqlResponse, AddListenGraphqlResponse, GetTracksTopGraphqlResponse
} from "../types.ts";
import {
  ADD_LISTEN_MUTATION,
  ADD_TRACK_TO_COLLECTION_MUTATION, CAN_EDIT_TRACK_QUERY, CREATE_TRACK_MUTATION, GET_GENRE_QUERY,
  GET_SINGLE_QUERY, GET_TRACKS_BY_USER_QUERY, GET_TRACKS_TOP_QUERY,
  REMOVE_TRACK_FROM_COLLECTION_MUTATION,
  REMOVE_TRACK_MUTATION, SET_GENRE_MUTATION
} from "../Queries.ts";

export class TrackRepository {
  async getTracksTop() {
    return await axiosGraph<GetTracksTopGraphqlResponse>(GET_TRACKS_TOP_QUERY);
  }

  async addListen(input: number) {
    return await axiosGraph<AddListenGraphqlResponse>(ADD_LISTEN_MUTATION, {trackId: input});
  }

  async getGenres() {
    return await axiosGraph<GetGenresGraphqlResponse>(GET_GENRE_QUERY);
  }

  async setGenres(input: SetGenresInput) {
    return await axiosGraph<SetGenresGraphqlResponse>(SET_GENRE_MUTATION, input);
  }

  async canEditTrack(input: number) {
    return await axiosGraph<CanEditTrackGraphqlResponse>(CAN_EDIT_TRACK_QUERY, {id: input});
  }

  async getSingle(input: number) {
    return await axiosGraph<GetSingleGraphqlResponse>(GET_SINGLE_QUERY, {id: input})
  }
  async getByUser(input: number) {
    return await axiosGraph<GetByUserGraphqlResponse>(GET_TRACKS_BY_USER_QUERY, {userId : input})
  }

  async removeTrack(input: number) {
    return await axiosGraph<RemoveTrackGraphqlResponse>(REMOVE_TRACK_MUTATION, {id: input})
  }

  async addTrackToCollection(input: AddTrackToCollectionInput) {
    return await axiosGraph<AddTrackToCollectionTGraphqlResponse>(ADD_TRACK_TO_COLLECTION_MUTATION, input)
  }

  async removeTrackFromCollection(input: RemoveTrackFromCollectionInput) {
    return await axiosGraph<RemoveTrackFromCollectionGraphqlResponse>(REMOVE_TRACK_FROM_COLLECTION_MUTATION, input)
  }

  async createTrack(input: CreateTrackInput) {
    const formData = new FormData();

    const operations = {
      query: CREATE_TRACK_MUTATION,
      variables: {
        ...input,
        icon: null,
        audioFile: null
      }
    };

    formData.append("operations", JSON.stringify(operations));

    const map: Record<string, string[]> = {};
    let fileIndex = 0;

    if (input.icon) {
      map[fileIndex] = ["variables.icon"];
      formData.append(fileIndex.toString(), input.icon);
      fileIndex++;
    }

    if (input.audioFile) {
      map[fileIndex] = ["variables.audioFile"];
      formData.append(fileIndex.toString(), input.audioFile);
      fileIndex++;
    }

    formData.append("map", JSON.stringify(map));

    const createdTrack: CreateTrackGraphqlResponse = await axiosInstance.post("", formData, {
      headers: {
        "GraphQL-Require-Preflight": "true",
      },
    });

    return createdTrack;
  }
}

export default new TrackRepository();
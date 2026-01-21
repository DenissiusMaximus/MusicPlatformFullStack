import axiosInstance, {axiosGraph} from "../utils/axios.ts";
import type {
  CanEditCollectionGraphqlResponse,
  CreateAlbumInput,
  CreateCollectionInput, DeleteCollectionGraphqlResponse, EditCollectionGraphqlResponse, EditCollectionInput,
  GetCollectionByIdGraphqlResponse,
  UserPlaylistsGraphqlResponse
} from "../types.ts";
import {
  CAN_EDIT_COLLECTION_QUERY,
  CREATE_ALBUM_MUTATION, CREATE_COLLECTION_MUTATION, DELETE_COLLECTION_MUTATION, EDIT_COLLECTION_MUTATION,
  GET_BY_ID_QUERY,
  USER_PLAYLISTS_QUERY
} from "../Queries.ts";

export class CollectionRepository {
  async userPlaylists() {
    return await axiosGraph<UserPlaylistsGraphqlResponse>(USER_PLAYLISTS_QUERY);
  }

  async editPlaylist(input: EditCollectionInput) {
    return await axiosGraph<EditCollectionGraphqlResponse>(EDIT_COLLECTION_MUTATION, input);
  }

  async canEditPlaylist(input: number) {
    return await axiosGraph<CanEditCollectionGraphqlResponse>(CAN_EDIT_COLLECTION_QUERY, {id: input});
  }

  async getById(input: number) {

    return await axiosGraph<GetCollectionByIdGraphqlResponse>(GET_BY_ID_QUERY, {id: input});
  }

  async createCollection(input: CreateCollectionInput) {
    const formData = new FormData();

    const operations = {
      query: CREATE_COLLECTION_MUTATION,
      variables: {
        ...input,
        icon: null
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

    formData.append("map", JSON.stringify(map));

    return axiosInstance.post("", formData, {
      headers: {
        "GraphQL-Require-Preflight": "true",
      },
    });
  }

  async deleteCollection(input: number) {
    return await axiosGraph<DeleteCollectionGraphqlResponse>(DELETE_COLLECTION_MUTATION, {id: input});
  }

  async createAlbum(input: CreateAlbumInput) {
    const formData = new FormData();

    const operations = {
      query: CREATE_ALBUM_MUTATION,
      variables: {
        ...input,
        icon: null,
        tracks: input.tracks?.map(track => ({
          ...track,
          audioFile: null
        })) ?? []
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

    input.tracks?.forEach((track, i) => {
      if (track.audioFile) {
        map[fileIndex] = [`variables.tracks.${i}.audioFile`];
        formData.append(fileIndex.toString(), track.audioFile);
        fileIndex++;
      }
    });

    formData.append("map", JSON.stringify(map));

    const res = await axiosInstance.post("", formData, {
      headers: {
        "GraphQL-Require-Preflight": "true",
      },
    });

    return res;

  }
}

export default new CollectionRepository();
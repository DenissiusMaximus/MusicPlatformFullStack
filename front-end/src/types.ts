import type {RouteObject} from "react-router";

export type AppRouteObject = RouteObject & {
  handle?: {
    enableAnimation?: boolean;
  };
  children?: AppRouteObject[];
};


export interface GraphQLResponse<T> {
  data: T;
  errors?: any[];
}

export interface LoginInput {
  login: string;
  password: string;
}

export interface RegisterInput {
  login: string;
  email: string;
  password: string;
  birthDate: string;
}

export interface Genre{
  genreId: number;
  name: string;
}

export interface TrackInput {
  name: string;
  description?: string;
  isExplicit: boolean;
  audioFile?: File | null;
  genres?: number[];
}

export interface CreateCollectionInput {
  name: string;
  type: CollectionType;
  createdAt?: string;
  isPublic?: boolean;
  description?: string;
  icon: File | null;
}

export interface EditCollectionInput {
  name?: string;
  description?: string;
  isPublic?: boolean;
  collectionId?: number;
}

export interface CreateAlbumInput {
  name: string;
  type: CollectionType;
  createdAt?: string;
  isPublic?: boolean;
  description?: string;
  icon: File | null;
  tracks?: TrackInput[];
}

export interface GetReviewsInput {
  targetType: ReviewType;
  targetId: number;
  limit?: number;
  offset?: number;
}

export interface CreateReviewInput {
  targetType: ReviewType;
  targetId: number;
  text: string;
  rating: number | null;
  reviewDate: string;
}

export interface EditReviewInput {
  reviewId: number;
  text?: string | null;
  rating?: number | null;
}


export interface GetRepliesInput {
  parentReviewId: number;
  limit?: number;
  offset?: number;
}

export interface CreateTrackInput {
  name: string;
  description?: string;
  releaseDate?: string;
  isExplicit: boolean;
  audioFile?: File | null;
  icon?: File | null;
  genres?: number[];
}

export interface AddTrackToCollectionInput {
  trackId: number;
  collectionId: number;
}

export interface SetGenresInput {
  trackId: number;
  genreIds: number[];
}

export interface RemoveTrackFromCollectionInput {
  trackId: number;
  collectionId: number;
}

export interface GetSingleGraphqlResponse {
  track: {
    getSingle: Track | null
  }
}
export interface GetByUserGraphqlResponse {
  track: {
    getByUser: Track[] | null
  }
}

export interface RemoveTrackGraphqlResponse {
  track: {
    removeTrack: boolean
  }
}

export interface AddTrackToCollectionTGraphqlResponse {
  track: {
    addToCollection: boolean
  }
}

export interface RemoveTrackFromCollectionGraphqlResponse {
  track: {
    removeFromCollection: boolean
  }
}

export interface GetRepliesGraphqlResponse {
  review: {
    replies: Review[]
  }
}

export interface DeleteReviewGraphqlResponse {
  review: {
    deleteReview: boolean
  }
}

export interface CreateReviewGraphqlResponse {
  review: {
    createReview: boolean
  }
}

export interface EditReviewGraphqlResponse {
  review: {
    editReview: boolean
  }
}

export interface CreateCollectionGraphqlResponse {
  collection: {
    createCollection: number | null;
  };
}

export interface DeleteCollectionGraphqlResponse {
  collection: {
    deleteCollection: boolean;
  };
}

export interface LoginGraphqlResponse {
  user: {
    login: AuthResponse | null;
  };
}

export interface GetUserGraphqlResponse {
  user: {
    getUser: User | null;
  };
}

export interface User {
  userId: number,
  login: string,
  birthDate: string
}

export interface RegisterGraphqlResponse {
  user: {
    register: AuthResponse | null;
  };
}

export interface IsUsernameAvailableGraphqlResponse {
  user: {
    isUsernameAvailable: boolean;
  };
}

export interface UserPlaylistsGraphqlResponse {
  collection: {
    userPlaylists: Collection[] | null
  }
}

export interface EditCollectionGraphqlResponse {
  collection: {
    editCollection: boolean
  }
}

export interface CanEditCollectionGraphqlResponse {
  collection: {
    canEdit: boolean
  }
}

export interface CanEditTrackGraphqlResponse {
  track: {
    canEdit: boolean | null
  }
}

export interface GetGenresGraphqlResponse {
  genre: {
    getGenres: Genre[] | null
  }
}

export interface AddListenGraphqlResponse {
  listen: {
    getTracksTop: {
      trackId: number;
      trackName: string;
      artistName: string;
      listenCount: number;
    }
  }
}

export interface GetTracksTopGraphqlResponse {
  listen: {
    getTracksTop: TopTrack[] | null
  }
}

export interface TopTrack {
  trackId: number;
  trackName: string;
  artistName: string;
  listenCount: number;
}

export interface SetGenresGraphqlResponse {
  genre: {
    setGenres: boolean
  }
}

export interface GetCollectionByIdGraphqlResponse {
  collection: {
    getById: Collection | null
  }
}

export interface SearchGraphqlResponse {
  search: {
    search: {
      artists: Artist[]
      collections: Collection[]
      tracks: Track[]
    }
  }
}

export interface Search {
  artists: Artist[]
  collections: Collection[]
  tracks: Track[]

}

export interface GetReviewsGraphqlResponse {
  review: {
    reviews: Review[]
  }
}

export interface CreateTrackGraphqlResponse {
  data:{
    data:{
      track: {
        createTrack: number | null
      }
    }
  }
}

export interface Artist {
  userId: number;
  username: string;
}

export interface Collection {
  collectionId: number;
  authorId: number;
  name: string;
  authorName: string;
  description: string | null;
  songsCount: number | null;
  collectionType: string;
  iconLink: string | null;
  songs: Track[] | null;
  averageRating: string | null;
}

export interface Track {
  trackId: number;
  name: string;
  authorName: string;
  authorId: number;
  albumId: number | null;
  albumName: string | null;
  trackLink: string | null;
  durationSeconds: number | null;
  iconLink: string | null;
  averageRating: string | null;
  listenCount: number | null;
  genres: string | null;
}

export interface Review {
  reviewID: number;
  reviewDate: string;
  userID: number;
  replyToReviewID: number | null;
  trackID: number | null;
  collectionID: number | null;
  rating: number | null;
  reviewText: string | null;
  isCurrentUserOwner?: boolean | null;
  authorLogin?: string;
}

export interface AuthResponse {
  token: string;
}

export enum CollectionType {
  Playlist = "PLAYLIST",
  Album = "ALBUM"
}

export enum ReviewType {
  Track = "TRACK",
  Album = "ALBUM",
  ParentReview = "PARENT_REVIEW"
}

export interface BaseState {
  loading: boolean;
  error: string | null;
}
export const LOGIN_MUTATION = `
mutation Login($login: String!, $password: String!){
        user {
            login(login: $login, password: $password){
                token
            }
        }
    }
`

export const REGISTER_MUTATION = `
mutation Register($login: String!, $password: String!, $email:String!, $birthDate: DateTime!){
        user {
            register(login: $login, password: $password email: $email birthDate: $birthDate){
                token
            }
        }
    }
`
export const IS_USERNAME_AVAILABLE_QUERY = `
query IsUsernameAvailable($username: String!){
        user {
            isUsernameAvailable(username: $username)
        }
    }
`

export const USER_PLAYLISTS_QUERY = `
query{
  collection{
    userPlaylists{
      collectionId
      name
      authorName
      description
      songsCount
      collectionType
      iconLink

      songs{
        trackId
        name
        authorName
        authorId
        albumId
        albumName
        trackLink
        durationSeconds
        iconLink
        averageRating
      }
    }
  }
}
`

export const GET_BY_ID_QUERY = `
query GetById($id: Int!){
  collection{
    getById(id: $id){
      authorId
      collectionId
      name
      authorName
      description
      songsCount
      collectionType
      iconLink
      averageRating

      songs{
        trackId
        name
        authorName
        authorId
        albumId
        albumName
        trackLink
        durationSeconds
        iconLink
        averageRating
        listenCount
      }
    }
  }
}
`

export const CREATE_ALBUM_MUTATION = `
  mutation CreateAlbum(
    $name: String!,
    $type: CollectionType!, 
    $createdAt: DateTime,
    $isPublic: Boolean,
    $description: String,
    $icon: FormFile,           
    $tracks: [TrackInputDto!] 
  ) {
    collection {
      createAlbum(
        name: $name,
        type: $type,
        createdAt: $createdAt,
        isPublic: $isPublic,
        description: $description,
        icon: $icon,
        tracks: $tracks
      )
    }
  }
`;

export const CREATE_COLLECTION_MUTATION = `
 mutation CreateCollection($name: String!, $createdAt: DateTime, $type: CollectionType!, $isPublic: Boolean, $description: String, $icon: FormFile){
  collection{
    createCollection(name: $name createdAt: $createdAt type: $type isPublic: $isPublic description: $description icon: $icon)
  }
}
`

export const DELETE_COLLECTION_MUTATION = `
 mutation DeleteCollection($id: Int!){
  collection{
    deleteCollection(collectionId: $id)
  }
}
`

export const SEARCH_QUERY = `
query Search($query: String!){
  search{
    search(query: $query){
    tracks {
      trackId
      name
      authorName
      authorId
      albumId
      albumName
      trackLink
      durationSeconds
      iconLink
      listenCount
    }
    artists {
      userId
      username
    }
    collections {
      collectionId
      name
      authorName
      description
      songsCount
      collectionType
      authorId
      iconLink
      songs {
        trackId
        name
        authorName
        authorId
        albumId
        albumName
        trackLink
        durationSeconds
        iconLink
        averageRating
        listenCount
      }
      }
    }
  }
}
`

export const GET_REVIEWS_QUERY = `
query GetReviews($targetType: ReviewType!, $targetId: Int!, $limit: Int, $offset: Int){
  review {
    reviews(targetType: $targetType, targetId: $targetId, limit: $limit, offset: $offset) {
      reviewID
      userID
      trackID
      collectionID
      rating
      reviewText
      reviewDate
      replyToReviewID
      isCurrentUserOwner
      authorLogin
    }
  }
}
`

export const GET_REPLIES_QUERY = `
query GetReplies($parentReviewId: Int!, $limit: Int, $offset: Int){
  review {
    replies(parentReviewId: $parentReviewId, limit: $limit, offset: $offset) {
      reviewID
      userID
      trackID
      collectionID
      rating
      reviewText
      reviewDate
      replyToReviewID
      authorLogin
    } 
  }
}
`

export const DELETE_REVIEW_MUTATION = `
mutation DeleteReview($id: Int!){
  review {
    deleteReview(reviewId: $id)
  }
}
`

export const CREATE_REVIEW_MUTATION = `
mutation CreateReview($targetType: ReviewType!, $targetId: Int!, $text: String!, $rating: Int, $reviewDate: DateTime){
  review {
    createReview(
      targetType: $targetType
      targetId: $targetId
      text: $text
      rating: $rating
      reviewDate: $reviewDate
    )
  } 
}`

export const GET_SINGLE_QUERY = `
query GetSingle($id: Int!){
  track {
    getSingle(id: $id) {
      trackId
      name
      authorName
      authorId
      albumId
      albumName
      trackLink
      durationSeconds
      iconLink
      averageRating
      listenCount
      genres
    }
  }
}
`

export const REMOVE_TRACK_MUTATION = `
mutation RemoveTrack($id: Int!){
  track {
    removeTrack(trackId: $id)
  }
}
`

export const ADD_TRACK_TO_COLLECTION_MUTATION = `
mutation AddTrackToCollection($trackId: Int!, $collectionId: Int!){
  track {
    addToCollection(trackId: $trackId, collectionId: $collectionId)
  }
}
`

export const REMOVE_TRACK_FROM_COLLECTION_MUTATION = `
mutation RemoveTrackFromCollection($trackId: Int!, $collectionId: Int!){
  track {
    removeFromCollection(trackId: $trackId, collectionId: $collectionId)
  }
}
`

export const CREATE_TRACK_MUTATION = `
mutation CreateTrack($audioFile: FormFile!, $name: String!, $description: String, $releaseDate: DateTime, $isExplicit: Boolean, $icon: FormFile, $genres: [Int!]){
  track {
    createTrack(
      audioFile: $audioFile
      name: $name
      description: $description
      releaseDate: $releaseDate
      isExplicit: $isExplicit
      icon: $icon
      genres: $genres
    )
  }
}
`
export const EDIT_COLLECTION_MUTATION = `
  mutation EditCollection($description: String, $isPublic: Boolean, $name: String, $collectionId: Int!){
  collection{
      editCollection(description: $description isPublic: $isPublic name: $name collectionId: $collectionId) 
  }
}
`

export const CAN_EDIT_COLLECTION_QUERY = `
  query CanEditCollection($id: Int!){
  collection{
      canEdit(collectionId: $id) 
  }
}
`

export const CAN_EDIT_TRACK_QUERY = `
  query CanEditTrack($id: Int!){
  track{
      canEdit(trackId: $id) 
  }
}
`


export const GET_TRACKS_BY_USER_QUERY = `
query GetTracks($userId: Int!){
  track{
    getByUser(userId: $userId) {
      trackId
      name
      authorName
      authorId
      albumId
      albumName
      trackLink
      durationSeconds
      iconLink
      averageRating
      listenCount
    }
  }
}
`

export const GET_USER_BY_ID_QUERY = `
query GetUser($id: Int!){
  user{
    getUser(id: $id) {
      userId
      login
      birthDate
    }
  }
}
`

export const EDIT_REVIEW_MUTATION = `
mutation EditReview($reviewId: Int!, $text: String!, $rating: Int){
  review{
    editReview(reviewId: $reviewId text: $text rating: $rating)
  }
}
`

export const GET_GENRE_QUERY = `
query{
  genre{
    getGenres {
      genreId
      name
    }
  }
}
`

export const SET_GENRE_MUTATION = `
    mutation SetGenres($trackId: Int!, $genreIds: [Int!]!) {
  genre {
    setToTrack(trackId: $trackId, genres: $genreIds)
  }
}  
`

export const ADD_LISTEN_MUTATION = `
mutation AddListen($trackId: Int!){
  listen {
    addListen(trackId: $trackId)
  }
}
`

export const GET_TRACKS_TOP_QUERY = `
query{
  listen {
    getTracksTop {
      trackId
      trackName
      artistName
      listenCount
    }
  }
}
`
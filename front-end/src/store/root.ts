import {combineReducers} from "redux";
import authReducer, { type AuthAction } from "./slices/auth.ts";
import collectionReducer, { type CollectionAction } from "./slices/collection.ts";
import searchReducer, { type SearchAction } from "./slices/search.ts";
import trackReducer, { type TrackAction } from "./slices/track.ts";
import reviewReducer, { type ReviewAction } from "./slices/review.ts";
import listenReducer, { type ListenAction } from "./slices/listen.ts";

export default combineReducers({
  auth: authReducer,
  collection: collectionReducer,
  search: searchReducer,
  track: trackReducer,
  review: reviewReducer,
  listen: listenReducer
});

export type RootAction = AuthAction | CollectionAction | SearchAction | TrackAction | ReviewAction | ListenAction;
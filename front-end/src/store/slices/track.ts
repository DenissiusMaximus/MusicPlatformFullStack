import {createSlice, type PayloadAction} from "@reduxjs/toolkit";
import type {
  AddTrackToCollectionInput,
  BaseState,
  CreateTrackInput, Genre,
  RemoveTrackFromCollectionInput, TopTrack,
  Track
} from "../../types.ts";

interface TrackState extends BaseState {
  track: Track | null;
  userTracks: Track[] | null;
  canEditTrack: boolean | null;
  genres: Genre[] | null;
  tracksTop: TopTrack[] | null;
}

const initialState: TrackState = {
  error: null,
  loading: false,
  track: null,
  userTracks: null,
  canEditTrack: null,
  genres: null,
  tracksTop: null,
}

const trackSlice = createSlice({
  name: 'track',
  initialState,
  reducers: {
    getById(state, _action: PayloadAction<number>) {
      state.loading = true;
    },
    getByIdFulfilled(state, action: PayloadAction<Track>) {
      state.track = action.payload;
      state.loading = false;
    },
    getByIdRejected(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },

    getByUserId(state, _action: PayloadAction<number>) {
      state.loading = true;
    },
    getByUserIdFulfilled(state, action: PayloadAction<Track[] | null>) {
      state.userTracks = action.payload;
      state.loading = false;
    },
    getByUserIdRejected(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    addTrackToCollection(state, _action: PayloadAction<AddTrackToCollectionInput>) {
      state.loading = true;
      state.error = null;
    },
    addTrackToCollectionFulfilled(state, _action: PayloadAction<boolean>) {
      state.loading = false;
    },
    addTrackToCollectionRejected(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    removeTrackFromCollection(state, _action: PayloadAction<RemoveTrackFromCollectionInput>) {
      state.loading = true;
    },
    removeTrackFromCollectionFulfilled(state, _action: PayloadAction<boolean>) {
      state.loading = false;
    },
    removeTrackFromCollectionRejected(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    canEditTrack(state, _action: PayloadAction<number>) {
      state.loading = true;
    },
    canEditTrackFulfilled(state, action: PayloadAction<boolean>) {
      state.canEditTrack = action.payload;
      state.loading = false;
    },
    canEditTrackRejected(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    deleteTrack(state, _action: PayloadAction<number>) {
      state.loading = true;
    }, deleteTrackFulfilled(state, _action: PayloadAction<boolean>) {
      state.loading = false;
    }, deleteTrackRejected(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    createTrack(state, _action: PayloadAction<CreateTrackInput>) {
      console.log(_action.payload)
      state.loading = true;
    },
    createTrackFulfilled(state, _action: PayloadAction<boolean>) {
      state.loading = false;
    },
    createTrackRejected(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    getGenres(state) {
      state.loading = true;
    },
    getGenresFulfilled(state, action: PayloadAction<Genre[]>) {
      state.loading = false;
      state.genres = action.payload;
    },
    getGenresRejected(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    getTopTracks(state) {
      state.loading = true;
    },
    getTopTracksFulfilled(state, action: PayloadAction<TopTrack[] | null>) {
      state.loading = false;
      state.tracksTop = action.payload;
    },
    getTopTracksRejected(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  getById,
  getByIdFulfilled,
  getByIdRejected,
  getByUserId,
  getByUserIdFulfilled,
  getByUserIdRejected,
  addTrackToCollection,
  addTrackToCollectionFulfilled,
  addTrackToCollectionRejected,
  removeTrackFromCollection,
  removeTrackFromCollectionFulfilled,
  removeTrackFromCollectionRejected,
  canEditTrack,
  canEditTrackFulfilled,
  canEditTrackRejected,
  deleteTrack,
  deleteTrackFulfilled,
  deleteTrackRejected,
  createTrack,
  createTrackFulfilled,
  createTrackRejected,
  getGenres,
  getGenresFulfilled,
  getGenresRejected,
  getTopTracks,
  getTopTracksFulfilled,
  getTopTracksRejected
} = trackSlice.actions;

export const selectTrack = (state: { track: TrackState }) => state.track.track;
export const selectUserTracks = (state: { track: TrackState }) => state.track.userTracks;
export const selectCanEditTrack = (state: { track: TrackState }) => state.track.canEditTrack;
export const selectGenres = (state: { track: TrackState }) => state.track.genres;
export const selectTopTracks = (state: { track: TrackState }) => state.track.tracksTop;

export type TrackAction = ReturnType<
    (typeof trackSlice.actions)[keyof typeof trackSlice.actions]
>;

export default trackSlice.reducer;

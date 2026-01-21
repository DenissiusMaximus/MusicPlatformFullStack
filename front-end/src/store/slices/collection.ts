import {createSlice, type PayloadAction} from "@reduxjs/toolkit";
import type {BaseState, Collection, CreateAlbumInput, EditCollectionInput} from "../../types.ts";
import type {RootState} from "../store.ts";

interface CollectionState extends BaseState {
  collection: Collection | null;
  userPlaylists: Collection[] | null;
  loading: boolean;
  error: string | null;
  canEditPlaylist: boolean;
  editedCollection: boolean | null;
  createdCollection: boolean
}

const initialState: CollectionState = {
  collection: null,
  userPlaylists: null,
  loading: false,
  error: null,
  canEditPlaylist: false,
  editedCollection: null,
  createdCollection: false
}

const collectionSlice = createSlice({
  name: 'collection',
  initialState,
  reducers: {
    getCollection(state, _action: PayloadAction<number>) {
      state.loading = true;
    },
    getCollectionFulfilled(state, action: PayloadAction<Collection | null>) {
      state.collection = action.payload;
      state.loading = false;
    },
    getCollectionRejected(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    getUserPlaylists(state) {
      state.loading = true;
    },
    getUserPlaylistsFulfilled(state, action: PayloadAction<Collection[] | null>) {
      state.userPlaylists = action.payload;
      state.loading = false;
    },
    getUserPlaylistsRejected(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },

    canEditPlaylist(state, _action: PayloadAction<number>) {
      state.loading = true;
    },
    canEditPlaylistFulfilled(state, action: PayloadAction<boolean>) {
      state.canEditPlaylist = action.payload;
      state.loading = false;
    },
    canEditPlaylistRejected(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },

    editCollection(state, _action: PayloadAction<EditCollectionInput>) {
      state.loading = true;
      state.error = null;
    },
    editCollectionFulfilled(state, action: PayloadAction<boolean>) {
      state.editedCollection = action.payload;
      state.loading = false;
    },
    editCollectionRejected(state, action: PayloadAction<string>) {
      state.editedCollection = false;
      state.loading = false;
      state.error = action.payload;
    },

    createCollection(state, _action: PayloadAction<CreateAlbumInput>) {
      state.loading = true;
      state.error = null;
    },
    createCollectionFulfilled(state, action: PayloadAction<boolean>) {
      state.createdCollection = action.payload;
      state.loading = false;
    },
    createCollectionRejected(state, action: PayloadAction<string>) {
      state.createdCollection = false;
      state.loading = false;
      state.error = action.payload;
    },
    deleteCollection(state, _action: PayloadAction<number>) {
      state.loading = true;
    },
    deleteCollectionFulfilled(state, _action: PayloadAction<boolean>) {
      state.loading = false;
    },
    deleteCollectionRejected(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    createAlbum(state, _action: PayloadAction<CreateAlbumInput>) {
      state.loading = true;
      state.error = null;
    },
    createAlbumFulfilled(state, action: PayloadAction<boolean>) {
      state.createdCollection = action.payload;
      state.loading = false;
    },
    createAlbumRejected(state, action: PayloadAction<string>) {
      state.createdCollection = false;
      state.loading = false;
      state.error = action.payload;
    }
  },
});

export const {
  getCollection,
  getCollectionFulfilled,
  getCollectionRejected,
  getUserPlaylists,
  getUserPlaylistsFulfilled,
  getUserPlaylistsRejected,
  canEditPlaylist,
  canEditPlaylistFulfilled,
  canEditPlaylistRejected,
  editCollection,
  editCollectionFulfilled,
  editCollectionRejected,
  createCollection,
  createCollectionFulfilled,
  createCollectionRejected,
  deleteCollection,
  deleteCollectionFulfilled,
  deleteCollectionRejected,
  createAlbumFulfilled,
  createAlbumRejected,
  createAlbum

} = collectionSlice.actions;

export const selectCollection = (state: RootState) => state.collection.collection;
export const selectUserPlaylists = (state: RootState) => state.collection.userPlaylists;
export const selectCanEditPlaylist = (state: RootState) => state.collection.canEditPlaylist;

export type CollectionAction = ReturnType<
    (typeof collectionSlice.actions)[keyof typeof collectionSlice.actions]
>;

export default collectionSlice.reducer;

import {createSlice, type PayloadAction} from "@reduxjs/toolkit";
import type {BaseState, Search} from "../../types.ts";

interface SearchState extends BaseState {
  searchResult: Search | null
}

const initialState: SearchState = {
  error: null,
  loading: false,
  searchResult: null
}

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    search(state, _action: PayloadAction<string>) {
      state.loading = true;
    },
    searchFulfilled(state, action: PayloadAction<Search>) {
      state.searchResult = action.payload;
      state.loading = false;
    },
    searchRejected(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },


  },
});

export const {
  search,
  searchFulfilled,
  searchRejected,
} = searchSlice.actions;

export const selectSearchResult = (state: { search: SearchState }) => state.search.searchResult;
export const selectSearchLoading = (state: { search: SearchState }) => state.search.loading;

export type SearchAction = ReturnType<
    (typeof searchSlice.actions)[keyof typeof searchSlice.actions]
>;

export default searchSlice.reducer;

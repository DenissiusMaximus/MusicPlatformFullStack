import {createSlice, type PayloadAction} from "@reduxjs/toolkit";
import type {BaseState, Track} from "../../types.ts";

interface ListenState extends BaseState {
  listeningNow: Track | null;
  isPlaying: boolean;
}

const initialState: ListenState = {
  error: null,
  loading: false,
  listeningNow: null,
  isPlaying: false,
}

const listenSlice = createSlice({
  name: 'listen',
  initialState,
  reducers: {
    addListen(state, _action: PayloadAction<number>) {
      state.error = null;
    },
    addListenFulfilled(_state, _action) {
    },
    addListenRejected(state, action) {
      state.error = action.payload;
    },
    setListeningNow(state, action: PayloadAction<Track>) {
      state.listeningNow = action.payload;
      state.isPlaying = true;
    },
    setPlaying(state) {
      state.isPlaying = !state.isPlaying;
    }
  },
});

export const {
  addListen,
  addListenFulfilled,
  addListenRejected,
  setListeningNow,
  setPlaying
} = listenSlice.actions;

export const selectListeningNow = (state: { listen: ListenState }) => state.listen.listeningNow;
export const selectIsPlaying = (state: { listen: ListenState }) => state.listen.isPlaying;

export type ListenAction = ReturnType<
    (typeof listenSlice.actions)[keyof typeof listenSlice.actions]
>;

export default listenSlice.reducer;

import rootReducer, { type RootAction } from "./root";
import {createEpicMiddleware, type Epic} from "redux-observable";
import {configureStore} from "@reduxjs/toolkit";
import rootEpic from "./epics";

export type RootState = ReturnType<typeof rootReducer>
export type AppEpic = Epic<RootAction, RootAction, RootState>;

const epicMiddleware = createEpicMiddleware<
    RootAction,
    RootAction,
    RootState
>();

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(epicMiddleware),
});

epicMiddleware.run(rootEpic);

export type AppDispatch = typeof store.dispatch;
export default store;


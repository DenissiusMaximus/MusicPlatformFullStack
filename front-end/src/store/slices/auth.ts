import {createSlice, type PayloadAction} from "@reduxjs/toolkit";
import type {AuthResponse, BaseState, LoginInput, RegisterInput, User} from "../../types.ts";
import type {RootState} from "../store.ts";

interface AuthState extends BaseState {
  token: string | null;
  isLoginAvailable: boolean;
  userById: User | null;
}

const initialState: AuthState = {
  token: null,
  loading: false,
  error: null,
  isLoginAvailable: true,
  userById: null
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login(state, _action: PayloadAction<LoginInput>) {
      state.loading = true;
    },
    loginFulfilled(state, action: PayloadAction<AuthResponse>) {
      state.token = action.payload.token;
      state.loading = false;
    },
    loginRejected(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },

    register(state, _action: PayloadAction<RegisterInput>) {
      state.loading = true;
    },
    registerFulfilled(state, action: PayloadAction<AuthResponse>) {
      state.token = action.payload.token;
      state.loading = false;
    },
    registerRejected(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },

    checkLoginAvailable(_state, _action: PayloadAction<string>) {
    },
    checkLoginAvailableFulfilled(state, action: PayloadAction<boolean>) {
      state.isLoginAvailable = action.payload
    },
    checkLoginAvailableRejected(state, action: PayloadAction<string>) {
      state.error = action.payload
    },

    getUserById(state, _action: PayloadAction<number>) {
      state.loading = true;
    },
    getUserByIdFulfilled(state, action: PayloadAction<User | null>) {
      state.loading = false;
      state.userById = action.payload;
    },
    getUserByIdRejected(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
      state.userById = null;
    },
  },
});

export const {
  login,
  loginFulfilled,
  loginRejected,
  register,
  registerFulfilled,
  registerRejected,
  checkLoginAvailable,
  checkLoginAvailableFulfilled,
  checkLoginAvailableRejected,
  getUserById,
  getUserByIdFulfilled,
  getUserByIdRejected
} = authSlice.actions;

export const selectLoginExists = (state: RootState) => state.auth.isLoginAvailable;
export const selectIsAuthenticated = (state: RootState) =>
    Boolean(state.auth.token);
export const selectUserById = (state: RootState) => state.auth.userById;

export type AuthAction = ReturnType<
    (typeof authSlice.actions)[keyof typeof authSlice.actions]
>;

export default authSlice.reducer;

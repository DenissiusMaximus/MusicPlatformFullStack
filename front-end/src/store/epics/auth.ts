import type {AppEpic} from "../store.ts";
import {catchError, debounceTime, from, map, of, switchMap} from "rxjs";
import {combineEpics, ofType} from "redux-observable";
import {
  checkLoginAvailable,
  checkLoginAvailableFulfilled,
  checkLoginAvailableRejected,
  login,
  loginFulfilled,
  loginRejected,
  register,
  registerFulfilled,
  registerRejected
} from "../slices/auth.ts";
import AuthRepository from "../../repositories/AuthRepository";
import {getUserById} from "../slices/auth.ts";
import {getUserByIdFulfilled} from "../slices/auth.ts";
import {getUserByIdRejected} from "../slices/auth.ts";

export const loginEpic: AppEpic = (action$) =>
    action$.pipe(
        ofType(login.type),
        switchMap((action) =>
            from(AuthRepository.login(action.payload)).pipe(
                map((data) => {
                  if (!data.user.login) {
                    return loginRejected("login failed");
                  }
                  localStorage.setItem("_t", data.user.login.token)

                  return loginFulfilled(data.user.login);
                }),
                catchError((err) => of(loginRejected(err.message)))
            )
        )
    );

export const registerEpic: AppEpic = (action$) =>
    action$.pipe(
        ofType(register.type),
        switchMap((action) =>
            from(AuthRepository.register(action.payload)).pipe(
                map((data) => {
                  if (!data.user.register) {
                    return registerRejected("registration failed");
                  }
                  localStorage.setItem("_t", data.user.register.token)

                  return registerFulfilled(data.user.register);
                }),
                catchError((err) => of(registerRejected(err.message)))
            )
        )
    );

export const isLoginAvailableEpic: AppEpic = (action$) =>
    action$.pipe(
        ofType(checkLoginAvailable.type),
        debounceTime(500),
        switchMap((action) =>
            from(AuthRepository.isUsernameAvailable(action.payload)).pipe(
                map((data) => {
                  const isAvailable = data.user.isUsernameAvailable;

                  return checkLoginAvailableFulfilled(isAvailable);
                }),
                catchError((err) => of(checkLoginAvailableRejected(err.message)))
            )
        )
    );

export const getUserByIdEpic: AppEpic = (action$) =>
    action$.pipe(
        ofType(getUserById.type),
        debounceTime(500),
        switchMap((action) =>
            from(AuthRepository.getUserById(action.payload)).pipe(
                map((data) => {
                  const result = data.user.getUser;

                  return getUserByIdFulfilled(result);
                }),
                catchError((err) => of(getUserByIdRejected(err.message)))
            )
        )
    );


export default combineEpics(loginEpic, registerEpic, isLoginAvailableEpic, getUserByIdEpic);
import type {AppEpic} from "../store.ts";
import {catchError, from, map, of, switchMap} from "rxjs";
import {combineEpics, ofType} from "redux-observable";
import {search, searchFulfilled, searchRejected} from "../slices/search.ts";
import SearchRepository from "../../repositories/SearchRepository";

export const searchEpic: AppEpic = (action$) =>
    action$.pipe(
        ofType(search.type),
        switchMap((action) =>
            from(SearchRepository.search(action.payload)).pipe(
                map((data) => {
                  const result = data.search.search

                  return searchFulfilled(result);
                }),
                catchError((err) => of(searchRejected(err.message)))
            )
        )
    );

export default combineEpics(searchEpic);
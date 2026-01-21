import type {AppEpic} from "../store.ts";
import {catchError, from, map, mergeMap, of, switchMap} from "rxjs";
import {combineEpics, ofType} from "redux-observable";
import {
  addTrackToCollection, addTrackToCollectionFulfilled, addTrackToCollectionRejected, canEditTrack,
  canEditTrackFulfilled, canEditTrackRejected, createTrack, createTrackFulfilled,
  createTrackRejected, deleteTrack, deleteTrackFulfilled, deleteTrackRejected,
  getById,
  getByIdFulfilled,
  getByIdRejected,
  getByUserId,
  getByUserIdFulfilled,
  getByUserIdRejected,
  getGenres, getGenresFulfilled,
  getGenresRejected,
  getTopTracks, getTopTracksFulfilled,
  getTopTracksRejected, removeTrackFromCollection, removeTrackFromCollectionFulfilled, removeTrackFromCollectionRejected
} from "../slices/track.ts";
import TrackRepository from "../../repositories/TrackRepository.ts";
import {
  getCollection
} from "../slices/collection.ts";
import {addListen, addListenFulfilled, addListenRejected} from "../slices/listen.ts";

export const getByIdEpic: AppEpic = (action$) =>
    action$.pipe(
        ofType(getById.type),
        switchMap((action) =>
            from(TrackRepository.getSingle(action.payload)).pipe(
                map((data) => {
                  const result = data.track.getSingle;

                  if (result == null)
                    return getByIdRejected("Не знайдено");

                  return getByIdFulfilled(result);
                }),
                catchError((err) => of(getByIdRejected(err.message)))
            )
        )
    );

export const getByUserIdEpic: AppEpic = (action$) =>
    action$.pipe(
        ofType(getByUserId.type),
        switchMap((action) =>
            from(TrackRepository.getByUser(action.payload)).pipe(
                map((data) => {
                  const result = data.track.getByUser;

                  if (result == null)
                    return getByUserIdRejected("Не знайдено");

                  return getByUserIdFulfilled(result);
                }),
                catchError((err) => of(getByUserIdRejected(err.message)))
            )
        )
    );

export const addTrackToCollectionEpic: AppEpic = (action$) =>
    action$.pipe(
        ofType(addTrackToCollection.type),
        switchMap((action) =>
            from(TrackRepository.addTrackToCollection(action.payload)).pipe(
                map((data) => {
                  const result = data.track.addToCollection;

                  if (result == null)
                    return addTrackToCollectionRejected("Не знайдено");

                  return addTrackToCollectionFulfilled(result);
                }),
                catchError((err) => of(addTrackToCollectionRejected(err.message)))
            )
        )
    );

export const removeFromCollectionEpic: AppEpic = (action$) =>
    action$.pipe(
        ofType(removeTrackFromCollection.type),
        switchMap((action) =>
            from(TrackRepository.removeTrackFromCollection(action.payload)).pipe(
                mergeMap((data) => {
                  const result = data.track.removeFromCollection;

                  if (result == null)
                    return of(removeTrackFromCollectionRejected("Не знайдено"));

                  return of(removeTrackFromCollectionFulfilled(result),
                      getCollection(action.payload.collectionId)
                  );
                }),
                catchError((err) => of(removeTrackFromCollectionRejected(err.message)))
            )
        )
    );

export const canEditTrackEpic: AppEpic = (action$) =>
    action$.pipe(
        ofType(canEditTrack.type),
        switchMap((action) =>
            from(TrackRepository.canEditTrack(action.payload)).pipe(
                map((data) => {
                  const track = data.track
                  if (track.canEdit == null) {
                    return canEditTrackRejected("Колекції не знайдено");
                  }

                  return canEditTrackFulfilled(track.canEdit);
                }),
                catchError((err) => of(canEditTrackRejected(err.message)))
            )
        )
    );

export const deleteTrackEpic: AppEpic = (action$) =>
    action$.pipe(
        ofType(deleteTrack.type),
        switchMap((action) =>
            from(TrackRepository.removeTrack(action.payload)).pipe(
                map((data) => {
                  const track = data.track
                  if (track.removeTrack == null) {
                    return deleteTrackRejected("Трек не знайдено");
                  }

                  return deleteTrackFulfilled(track.removeTrack);
                }),
                catchError((err) => of(deleteTrackRejected(err.message)))
            )
        )
    );

export const createTrackEpic: AppEpic = (action$) =>
    action$.pipe(
        ofType(createTrack.type),
        switchMap((action) =>
            from(TrackRepository.createTrack(action.payload)).pipe(
                map((data) => {
                  const track = data.data.data.track.createTrack
                  if (Number(track) ===0 || track == null) {
                    return createTrackRejected("Помилка створення");
                  }

                  return createTrackFulfilled(track > 0);
                }),
                catchError((err) => of(createTrackRejected(err.message)))
            )
        )
    );

export const getGenresEpic: AppEpic = (action$) =>
    action$.pipe(
        ofType(getGenres.type),
        switchMap(() =>
            from(TrackRepository.getGenres()).pipe(
                map((data) => {
                  const result = data.genre.getGenres

                  if (result == null) {
                    return getGenresRejected("Помилка отримання");
                  }

                  return getGenresFulfilled(result);
                }),
                catchError((err) => of(getGenresRejected(err.message)))
            )
        )
    );

export const addListenEpic: AppEpic = (action$) =>
    action$.pipe(
        ofType(addListen.type),
        switchMap((action) =>
            from(TrackRepository.addListen(action.payload)).pipe(
                map((data) => {
                  const result = data.listen.addListen
                  if (result == null) {
                    return addListenRejected("Помилка додавання прослуховування");
                  }

                  return addListenFulfilled(result);
                }),
                catchError((err) => of(addListenRejected(err.message)))
            )
        )
    );

export const getTopEpic: AppEpic = (action$) =>
    action$.pipe(
        ofType(getTopTracks.type),
        switchMap(() =>
            from(TrackRepository.getTracksTop()).pipe(
                map((data) => {
                  const result = data.listen.getTracksTop;
                  if (result == null) {
                    return getTopTracksRejected("Помилка");
                  }

                  return getTopTracksFulfilled(result);
                }),
                catchError((err) => of(getTopTracksRejected(err.message)))
            )
        )
    );


export default combineEpics(getByIdEpic, getByUserIdEpic, addTrackToCollectionEpic, removeFromCollectionEpic, canEditTrackEpic, deleteTrackEpic, createTrackEpic, getGenresEpic, addListenEpic, getTopEpic);
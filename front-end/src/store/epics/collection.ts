import type {AppEpic} from "../store.ts";
import {catchError, from, map, mergeMap, of, switchMap} from "rxjs";
import {combineEpics, ofType} from "redux-observable";
import {
  canEditPlaylist, canEditPlaylistFulfilled, canEditPlaylistRejected,
  createAlbum, createAlbumFulfilled, createAlbumRejected, createCollection, createCollectionFulfilled,
  createCollectionRejected, deleteCollection, deleteCollectionFulfilled, deleteCollectionRejected, editCollection,
  editCollectionFulfilled, editCollectionRejected,
  getCollection,
  getCollectionFulfilled,
  getCollectionRejected, getUserPlaylists, getUserPlaylistsFulfilled,
  getUserPlaylistsRejected
} from "../slices/collection.ts";
import CollectionRepository from "../../repositories/CollectionRepository";

export const getCollectionEpic: AppEpic = (action$) =>
    action$.pipe(
        ofType(getCollection.type),
        switchMap((action) =>
            from(CollectionRepository.getById(action.payload)).pipe(
                map((data) => {
                  const collection = data.collection
                  if (collection.getById == null) {
                    return getCollectionRejected("Колекцію не знайдено");
                  }

                  return getCollectionFulfilled(collection.getById);
                }),
                catchError((err) => of(getCollectionRejected(err.message)))
            )
        )
    );

export const getUserPlaylistsEpic: AppEpic = (action$) =>
    action$.pipe(
        ofType(getUserPlaylists.type),
        switchMap(() =>
            from(CollectionRepository.userPlaylists()).pipe(
                map((data) => {
                  const collection = data.collection
                  if (collection.userPlaylists == null) {
                    return getUserPlaylistsRejected("Колекції не знайдено");
                  }

                  return getUserPlaylistsFulfilled(collection.userPlaylists);
                }),
                catchError((err) => of(getUserPlaylistsRejected(err.message)))
            )
        )
    );

export const canEditPlaylistEpic: AppEpic = (action$) =>
    action$.pipe(
        ofType(canEditPlaylist.type),
        switchMap((action) =>
            from(CollectionRepository.canEditPlaylist(action.payload)).pipe(
                map((data) => {
                  const collection = data.collection
                  if (collection.canEdit == null) {
                    return canEditPlaylistRejected("Колекції не знайдено");
                  }

                  return canEditPlaylistFulfilled(collection.canEdit);
                }),
                catchError((err) => of(canEditPlaylistRejected(err.message)))
            )
        )
    );

export const editPlaylistEpic: AppEpic = (action$) =>
    action$.pipe(
        ofType(editCollection.type),
        switchMap((action) =>
            from(CollectionRepository.editPlaylist(action.payload)).pipe(
                map((data) => {
                  const collection = data.collection
                  if (collection.editCollection == null) {
                    return editCollectionRejected("Помилка редагування");
                  }

                  return editCollectionFulfilled(collection.editCollection);
                }),
                catchError((err) => of(editCollectionRejected(err.message)))
            )
        )
    );

export const createCollectionEpic: AppEpic = (action$) =>
    action$.pipe(
        ofType(createCollection.type),
        switchMap((action) =>
            from(CollectionRepository.createCollection(action.payload)).pipe(
                mergeMap((data) => {
                  const result: number = data.data.data.collection.createCollection;
                  if (result == null) {
                    return of(createCollectionRejected("Помилка створення"));
                  }

                  return of(createCollectionFulfilled(result > 0),
                      getUserPlaylists());
                }),
                catchError((err) => of(createCollectionRejected(err.message)))
            )
        )
    );

export const createAlbumEpic: AppEpic = (action$) =>
    action$.pipe(
        ofType(createAlbum.type),
        switchMap((action) =>
            from(CollectionRepository.createAlbum(action.payload)).pipe(
                mergeMap((data) => {
                  const result: number = data.data.data.collection.createCollection;
                  if (result == null) {
                    return of(createAlbumRejected("Помилка створення"));
                  }

                  return of(createAlbumFulfilled(result > 0));
                }),
                catchError((err) => of(createAlbumRejected(err.message)))
            )
        )
    );


export const deleteCollectionEpic: AppEpic = (action$) =>
    action$.pipe(
        ofType(deleteCollection.type),
        switchMap((action) =>
            from(CollectionRepository.deleteCollection(action.payload)).pipe(
                mergeMap((data) => {
                  const result = data.collection.deleteCollection;
                  if (result == null) {
                    return of(deleteCollectionRejected("Помилка видалення"));
                  }

                  return of(deleteCollectionFulfilled(result),
                      getUserPlaylists());
                }),
                catchError((err) => of(deleteCollectionRejected(err.message)))
            )
        )
    );


export default combineEpics(getCollectionEpic, getUserPlaylistsEpic, canEditPlaylistEpic, editPlaylistEpic, createCollectionEpic, deleteCollectionEpic, createAlbumEpic);
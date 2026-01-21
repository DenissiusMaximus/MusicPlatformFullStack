import {useAppDispatch, useAppSelector} from "../hooks/redux.ts";
import {useEffect, useState} from "react";
import {canEditPlaylist, getCollection, selectCanEditPlaylist, selectCollection} from "../store/slices/collection.ts";
import {type Collection, ReviewType} from "../types.ts";
import {TrackBigCard} from "../components/TrackBigCard.tsx";
import Separator from "../assets/separator.svg?react";
import {TrackSmallCard} from "../components/TrackSmallCard.tsx";
import {useParams} from "react-router";
import {ReviewsList} from "../components/reviewsList.tsx";

export const CollectionPage = () => {
  const dispatch = useAppDispatch();
  const {id} = useParams<{ id: string }>();

  const [showReviews, setShowReviews] = useState(false);

  useEffect(() => {
    dispatch(getCollection(Number(id)));
    dispatch(canEditPlaylist(Number(id)));
  }, [id, dispatch]);

  const canEdit = useAppSelector(selectCanEditPlaylist);
  const selectedCollection: Collection | null = useAppSelector(selectCollection);

  const onRatingClick = () => {
    setShowReviews(!showReviews);
  }

  if (selectedCollection == null)
    return <div>Loading...</div>;

  const collection: Collection = selectedCollection;

  return (
      <div className={'flex flex-col items-center justify-center w-full h-full overflow-hidden px-20 pt-10'}>
        <TrackBigCard
            className={`w-full`}
            author={collection.authorName}
            name={collection.name}
            type={collection.collectionType}
            iconLink={collection.iconLink}
            avgRating={collection.averageRating ? String(collection.averageRating) : "0"}
            description={collection.description}
            songsCount={collection.songsCount}
            objectId={canEdit ? collection.collectionId : null}
            isRelease={!!(canEdit && collection.collectionType === "Album")}
            onRatingClick={onRatingClick}
        />

        <Separator className={'w-full mt-10 mb-10'}/>

        <div
            className={'flex flex-col items-center justify-start gap-5 w-full pb-10 flex-1 overflow-y-scroll scrollbar-hide'}>

          {!showReviews ? (
              collection.songs && collection.songs.map((track) =>
                  <TrackSmallCard
                      className={'w-full'}
                      key={track.trackId}
                      track={track}
                      currentPlaylistId={canEdit ? collection.collectionId : undefined}
                  />
              )
          ) : (
              <ReviewsList collectionId={collection.collectionId} type={ReviewType.Album}/>
          )}

        </div>
      </div>
  )
}


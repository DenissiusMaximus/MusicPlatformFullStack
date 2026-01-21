import {useParams} from "react-router";
import {useAppDispatch, useAppSelector} from "../hooks/redux.ts";
import {useEffect, useState} from "react";
import {canEditTrack, getById, selectCanEditTrack, selectTrack} from "../store/slices/track.ts";
import {TrackBigCard} from "../components/TrackBigCard.tsx";
import {TrackSmallCard} from "../components/TrackSmallCard.tsx";
import Separator from "../assets/separator.svg?react";
import {ReviewType} from "../types.ts";
import {ReviewsList} from "../components/reviewsList.tsx";

export const TrackPage = () => {
  const {id} = useParams<{ id: string }>();
  const dispatch = useAppDispatch();

  const [showReviews, setShowReviews] = useState(false);

  const track = useAppSelector(selectTrack);
  const canEdit = useAppSelector(selectCanEditTrack);

  useEffect(() => {
    dispatch(getById(Number(id)))
    dispatch(canEditTrack(Number(id)))
  }, [id, dispatch]);

  const onRatingClick = () => {
    setShowReviews(!showReviews);
  }

  if (!track) return <div>Не знайдено</div>;

  return (
      <div className={'flex flex-col items-center justify-start w-full h-full overflow-hidden px-20 pt-10'}>
        <TrackBigCard
            className={'w-full'}
            author={track.authorName || ""}
            name={track.name || ""}
            type={"Track"}
            iconLink={track.iconLink || null}
            avgRating={track.averageRating ? String(track.averageRating) : "0"}
            objectId={canEdit ? track.trackId : null}
            isRelease={!!canEdit}
            onRatingClick={onRatingClick}
            genres={track.genres}
        />

        <Separator className={'w-full mt-10 mb-10'}/>

        <div className={'flex flex-col items-center justify-start gap-5 w-full pb-10 flex-1 overflow-y-scroll scrollbar-hide'}>
          {!showReviews ? (
              <TrackSmallCard className={'w-full'} track={track}/>
          ) : (
              <ReviewsList collectionId={track.trackId} type={ReviewType.Track}/>
          )}
        </div>
      </div>
  );
};
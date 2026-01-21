import {useParams} from "react-router";
import {useAppDispatch, useAppSelector} from "../hooks/redux.ts";
import {useEffect} from "react";
import {getUserById, selectUserById} from "../store/slices/auth.ts";
import {getByUserId, selectUserTracks} from "../store/slices/track.ts";
import {TrackBigCard} from "../components/TrackBigCard.tsx";
import {TrackSmallCard} from "../components/TrackSmallCard.tsx";

export const UserPage = () => {
  const {id} = useParams<{ id: string }>();

  const dispatch = useAppDispatch();

  const user = useAppSelector(selectUserById);
  const tracks = useAppSelector(selectUserTracks);

  useEffect(() => {
    dispatch(getUserById(Number(id)))
    dispatch(getByUserId(Number(id)))
  }, []);

  const iconLink = tracks?.length ? tracks[tracks?.length - 1].iconLink : undefined;

  return <div className={'flex flex-col items-center justify-center w-full h-full overflow-hidden px-20 pt-10 '}>
    {user && <TrackBigCard className={"w-full mb-20"} author={""} name={user.login} type={"Виконавець"} iconLink={iconLink}/>}

    <div
        className={'flex flex-col items-center justify-start gap-5 w-full pb-10 flex-1 overflow-y-scroll scrollbar-hide'}>

      {tracks && tracks.map((track) =>
          <TrackSmallCard className={'w-full'}
                          key={track.trackId}
                          track={track}/>
      )}


    </div>
  </div>
};
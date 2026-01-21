import {useAppDispatch, useAppSelector} from "../hooks/redux.ts";
import {getTopTracks, selectTopTracks} from "../store/slices/track.ts";
import {useEffect} from "react";
import {ObjectMiniCard} from "../ObjectMiniCard.tsx";

export const MonthTop = () => {
  const top = useAppSelector(selectTopTracks);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getTopTracks())
  }, []);

  return (
      <div className="flex flex-col items-center justify-start h-full w-full px-30 mt-10 overflow-hidden">

        <h1 className="text-5xl shrink-0">Найбільше прослуховувань за місяць</h1>

        <div className={
            "flex flex-col items-start " +
            "justify-start " +
            "w-full mt-10 gap-5 " +
            "overflow-y-auto scrollbar-hide " +
            "flex-1 min-h-0 " +
            "pb-10"
        }>
          {top?.map((track, index) => {
            return (
                <ObjectMiniCard
                    className={"w-full shrink-0"}
                    key={index}
                    leftLabel1={{name: track.trackName, link: track.trackId.toString()}}
                    leftLabel2={{name: track.artistName}}
                    endLabel={{name: track.listenCount.toString() + "🎧"}}
                />
            )
          })}
        </div>
      </div>
  );
}
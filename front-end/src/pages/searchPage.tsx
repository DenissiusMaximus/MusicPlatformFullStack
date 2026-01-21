import {useAppDispatch, useAppSelector} from "../hooks/redux.ts";
import {useEffect} from "react";
import {search, selectSearchLoading, selectSearchResult} from "../store/slices/search.ts";
import {TrackSmallCard} from "../components/TrackSmallCard.tsx";
import {ObjectMiniCard} from "../ObjectMiniCard.tsx";

type SearchPageProps = {
  query: string
}
export const SearchPage = ({query}: SearchPageProps) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(search(query))
  }, [dispatch, query]);

  const result = useAppSelector(selectSearchResult);
  const loading = useAppSelector(selectSearchLoading);

  return (
      <div
          className={'flex flex-col items-center justify-start gap-10 w-full px-20 pt-10 overflow-y-scroll scrollbar-hide pb-10 h-full'}>
        {loading && <div className={`flex items-center justify-center text-5xl h-full`}>Завантаження </div>}
        {(!loading && result) && <>
          {result.tracks.length > 0 && <div className={"w-full flex items-start"}>Треки:</div>}
          {result.tracks.map((track, index) => {
            return (
                <TrackSmallCard key={index} track={track} className={"w-full"}/>
            )
          })}

          {result.collections.length > 0 && <div className={"w-full flex items-start"}>Колекції:</div>}
          {result.collections.map((collection, index) => {
            return (
                <ObjectMiniCard key={index}
                                leftLabel1={{
                                  name: collection.name,
                                  link: "/collection/" + collection.collectionId.toString()
                                }}
                                leftLabel2={{
                                  name: collection.authorName?.toString(),
                                  link: "/user/" + collection.authorId?.toString()
                                }} className={"w-full"}
                                middleLabel={{name: collection.collectionType || ""}}
                                iconLink={collection.iconLink || null}

                />
            )
          })}

          {result.artists.length > 0 && <div className={"w-full flex items-start"}>Артисти:</div>}
          {result.artists.map((artist, index) => {
            return (
                <ObjectMiniCard key={index}
                                leftLabel1={{name: artist.username, link: "/user/" + artist.userId.toString()}}
                                className={"w-full"}/>
            )
          })}
        </>}
      </div>
  )
}
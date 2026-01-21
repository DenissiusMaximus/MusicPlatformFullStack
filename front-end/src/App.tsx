import './App.css'
import Search from "./assets/Search.svg?react";
import AddCircle from "./assets/add_circle.svg?react";
import {useEffect, useState} from "react";
import {ObjectMiniCard} from "./ObjectMiniCard.tsx";
import {useDispatch} from "react-redux";
import {getUserPlaylists, selectUserPlaylists} from "./store/slices/collection.ts";
import {useAppSelector} from "./hooks/redux.ts";
import {RouterProvider} from "react-router";
import router from "./router.tsx";
import {SearchPage} from "./pages/searchPage.tsx";
import clsx from "clsx";

function App() {
  const [showSearch, setShowSearch] = useState<boolean>(false);
  const dispatch = useDispatch();
  const userPlaylists = useAppSelector(selectUserPlaylists)
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    dispatch(getUserPlaylists())
  }, [dispatch])

  return (
      <div className={'absolute w-screen h-screen overflow-hidden'}>
        <div className={'absolute w-full h-full bg-[#575352]'}></div>
        <div className={'absolute left-1/12 top-1/6 w-1/3 h-2/3 bg-white rounded-full'}></div>
        <div className={'absolute w-full h-full bg-[#575352]/80 backdrop-blur-[100px]'}></div>

        <div
            className={'absolute w-1/6 h-full left-0 flex flex-col items-center justify-between px-4 py-10 overflow-y-scroll scrollbar-hide'}>
          <div
              className={'overflow-y-scroll scrollbar-hide h-5/6 w-full flex flex-col items-center justify-start'}>
            {userPlaylists && userPlaylists.map((playlist) =>
                <button className={`w-full`}>
                  <ObjectMiniCard
                      className={`w-full text-[#C8C3C5]`}
                      iconLink={playlist.iconLink}
                      leftLabel1={{name: playlist.name, link: "/collection/" + playlist.collectionId}}/>
                </button>
            )}
          </div>
          <div>
            <div className={`flex flex-col items-start justify-start h-16 w-full`}>
              <div className={clsx('flex flex-row items-start h-16 w-full')}>
                <div className="relative mr-3 shrink-0">

                  <AddCircle
                      className={'w-16 text-[#C8C3C5]'}
                  />
                </div>

                <div className={clsx('flex flex-col items-start justify-center w-full h-full')}>
                  <a href={"/createCollection"} className={'text-xl text-[#C8C3C5]'}>Додати плейлист</a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={'absolute w-5/6 h-full right-0 bg-white rounded-l-[52px] shadow-2xl ' +
            'flex flex-col items-center justify-start overflow-hidden' }>
          <div className={'h-22 flex flex-row items-center justify-end pr-10 w-full'}>
            <div className={'bg-[#EFEFEF] rounded-full h-12.5 w-2/4 flex flex-row items-center justify-between px-3'}>
              <Search className={``}/>
              <input className={`ml-2 w-full h-full focus:outline-none`} type="text"
                     value={searchQuery}
                     onInput={() => setShowSearch(true)}
                     onChange={(e) => {
                       const value = e.target.value;
                       setSearchQuery(value);

                       setShowSearch(value.length > 0);
                     }}/>
            </div>
            <a className={"ml-100 w-12"} href="/add">
              <AddCircle
                  className={'w-12 text-[#C8C3C5] '}
              />
            </a>
          </div>
          {!showSearch
              ? <RouterProvider router={router}/>
              : <SearchPage query={searchQuery}/>}
        </div>
      </div>
  );
}

export default App



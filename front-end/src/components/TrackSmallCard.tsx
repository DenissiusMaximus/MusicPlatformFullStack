import type {AddTrackToCollectionInput, RemoveTrackFromCollectionInput, Track} from "../types.ts";
import {useEffect, useState} from "react";
import clsx from "clsx";
import PlayButton from "../assets/PlayButton.svg?react";
import PauseButton from "../assets/PauseButton.svg?react";
import MenuDots from "../assets/MenuDots.svg?react";
import {formatTime} from "../utils/utils.ts";
import {Item, Menu, useContextMenu, type ItemParams, Submenu} from "react-contexify";
import {useAppDispatch, useAppSelector} from "../hooks/redux.ts";
import {getUserPlaylists, selectUserPlaylists} from "../store/slices/collection.ts";
import {addTrackToCollection, removeTrackFromCollection} from "../store/slices/track.ts";
import {addListen, selectIsPlaying, selectListeningNow, setListeningNow, setPlaying} from "../store/slices/listen.ts";


enum PlayTrack {
  PLAYING,
  PAUSED
}

type MenuProps = {
  trackId: number;
  playlistId?: number | null;
}

type ItemData = {
  targetPlaylistId?: number;
};

type TrackSmallCardProps = {
  track: Track,
  currentPlaylistId?: number | null,
  className?: string
}
export const TrackSmallCard = ({
                                 track,
                                 currentPlaylistId = null,
                                 className = ""
                               }: TrackSmallCardProps) => {
  let iconLink: string;
  if (track.iconLink == null)
    iconLink = "../../src/assets/default.png"
  else
    iconLink = track.iconLink;

  const MENU_ID = "track_menu" + track.trackId.toString();
  const dispatch = useAppDispatch();

  const userPlaylists = useAppSelector(selectUserPlaylists);

  useEffect(() => {
    dispatch(getUserPlaylists())

  }, []);

  const {show} = useContextMenu({id: MENU_ID});

  function handleContextMenu(event: any) {
    show({
      event,
      props: {
        trackId: track.trackId
      }
    });
  }

  function handleMenuDotsClick(event: any) {
    event.stopPropagation();
    show({
      event,
      props: {
        trackId: track.trackId
      }
    });
  }

  const handleItemClick = ({id, props, data}: ItemParams<MenuProps, ItemData>) => {
    const trackId = props?.trackId;

    switch (id) {
      case 'delete-from-playlist':
        if(!trackId || !currentPlaylistId)
          break;
        const payloadDel: RemoveTrackFromCollectionInput = {
          trackId: trackId,
          collectionId: currentPlaylistId
        }
        dispatch(removeTrackFromCollection(payloadDel));
        break;

      case 'add-to-playlist':
        if(!trackId || !data?.targetPlaylistId)
          break;
        const payloadAdd: AddTrackToCollectionInput = {
          trackId: trackId,
          collectionId: data?.targetPlaylistId
        }
        dispatch(addTrackToCollection(payloadAdd));
        break;


      default:
        console.log(`Action: ${id} on track ${trackId}`);
    }
  }

  const [trackState, setTrackState] = useState<PlayTrack | null>(null);

  const listening = useAppSelector(selectListeningNow)
  const isPlaying = useAppSelector(selectIsPlaying)
  useEffect(() => {
    if (listening && listening.trackId === track.trackId) {
      setTrackState(isPlaying ? PlayTrack.PLAYING : PlayTrack.PAUSED);
    } else {
      setTrackState(null);
    }
  }, [listening, isPlaying, track.trackId]);

  const onPlayButtonClick = () => {
    dispatch(setPlaying());
    if(trackState === null){
      dispatch(setListeningNow(track));
      dispatch(addListen(track.trackId))
    }
  }

  const [showMenuDots, setShowMenuDots] = useState<boolean>(false)

  return (
      <div onContextMenu={handleContextMenu}
           className={`flex flex-row items-center h-16 ${className}`}
           onMouseEnter={() => setShowMenuDots(true)}
           onMouseLeave={() => setShowMenuDots(false)}>
        <div className={'flex flex-row items-start h-16 w-2/4'}>
          <div className="relative mr-3 shrink-0" onClick={() => onPlayButtonClick()}>
            <img
                alt={'Icon'}
                src={iconLink}
                className={clsx(
                    'w-16 rounded-2xl shadow-xl',
                    trackState !== null && 'brightness-50'
                )}
            />
            {trackState === PlayTrack.PLAYING && (
                <PlayButton
                    className={
                        'text-white absolute w-6 h-6 ' +
                        'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'
                    }
                />
            )}
            {trackState === PlayTrack.PAUSED && (
                <PauseButton
                    className={
                        'text-white absolute w-6 h-6 ' +
                        'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'
                    }
                />
            )}
          </div>


          <div className={'flex flex-col items-start justify-between h-full'}>
            <a href={"/track/" + track.trackId} className={'text-xl text-[#0F0F0F]'}>{track.name}</a>
            <div className={'text-[#7A7A7A]'}>{track.authorName}</div>
          </div>
        </div>

        <a href={"/collection/" + track.albumId} className={'text-[#7A7A7A] w-1/4'}>{track.albumName}</a>

        <div className={'flex flex-row items-center justify-end h-full gap-5 w-1/4'}>
          {!!track.listenCount && <div className={"text-[#7A7A7A] mr-6"}>{track.listenCount}🎧</div>}
          <div className={'text-[#7A7A7A]'}>{formatTime(track.durationSeconds)}</div>
          <MenuDots onClick={handleMenuDotsClick} className={clsx('w-5 h-5 text-[#7A7A7A] opacity-0',
              showMenuDots && 'opacity-100 transition-opacity duration-200'
          )}/>
        </div>
        <Menu
            className="contexify"
            animation="fade"
            id={MENU_ID}>
          {currentPlaylistId && <Item id="delete-from-playlist" onClick={handleItemClick}>Видалити з плейліста</Item>}
          <Submenu label="Додати в плейліст">
            {userPlaylists && userPlaylists.map((playlist) =>
                <Item id="add-to-playlist" data={{targetPlaylistId: playlist.collectionId}}
                      onClick={handleItemClick}>{playlist.name}</Item>)

            }
          </Submenu>
        </Menu>

      </div>
  )
}
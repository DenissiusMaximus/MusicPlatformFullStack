import {useState} from "react";
import Dot from "../assets/Dot 2.svg?react";
import Star from "../assets/Star.svg?react";
import {useAppDispatch} from "../hooks/redux.ts";
import {deleteCollection, editCollection} from "../store/slices/collection.ts";
import type {EditCollectionInput} from "../types.ts";
import {useNavigate} from "react-router";
import {deleteTrack} from "../store/slices/track.ts";

type TrackBigCardProps = {
  author: string,
  name: string,
  type: string,
  songsCount?: number | null,
  album?: string,
  description?: string | null,
  avgRating?: string | null,
  iconLink?: string | null,
  objectId?: number | null,
  className?: string,
  isRelease?: boolean,
  genres?: string | null,
  onRatingClick?: () => void
}

export const TrackBigCard = ({
                               author,
                               name,
                               type,
                               songsCount,
                               album,
                               genres,
                               description = null,
                               avgRating = null,
                               iconLink = null,
                               objectId = null,
                               className = "",
                               isRelease = false,
                               onRatingClick = () => {
                               }
                             }: TrackBigCardProps) => {

  const currentIconLink = iconLink ?? "../../src/assets/default.png";

  const [localName, setLocalName] = useState(name);
  const [localDescription, setLocalDescription] = useState(description || "");
  const [localIsPublic, setLocalIsPublic] = useState(false);

  const [isEditing, setIsEditing] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState<boolean>(false);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const onDeleteCollection = () => {
    if (confirm("Ви впевнені, що хочете видалити цей об'єкт?")) {
      if (type === "Track") {
        dispatch(deleteTrack(objectId!));
      } else {
        dispatch(deleteCollection(objectId!));
      }

      navigate(-1);
    }
  };

  const handleEditToggle = () => {
    setShowFullDescription(false);

    if (isEditing && !isRelease) {
      if (objectId === null || objectId === undefined)
        return;

      const newCollection: EditCollectionInput = {
        name: localName,
        description: localDescription,
        isPublic: localIsPublic,
        collectionId: objectId
      }
      dispatch(editCollection(newCollection));
    }
    setIsEditing(!isEditing);
  };

  const handleCancel = () => {
    setLocalName(name);
    setLocalDescription(description || "");
    setIsEditing(false);
  }

  const isReadOnly = isRelease;

  return (
      <div className={`flex flex-row items-start justify-between h-60 ${className}`}>
        <div className={'flex flex-row items-start justify-center h-60 '}>
          <img alt={'Icon'} src={currentIconLink}
               className={'w-60 h-60 rounded-2xl mr-3 shadow-xl object-cover'}/>

          <div className={'flex flex-col items-start justify-between h-full py-2 w-full'}>

            {!showFullDescription &&
                <div className={'text-2xl text-[#7A7A7A] flex flex-row gap-3 items-center justify-start w-full'}>
                  <div
                      className={`bg-transparent outline-none border-none p-0 w-auto min-w-25 placeholder-[#7A7A7A] text-[#7A7A7A]`}>
                    {author}
                  </div>
                  {album && <>
                    <Dot className={"text-[#7A7A7A] shrink-0"}/>
                    <span>{album}</span>
                  </>}
                </div>
            }

            <div className="w-full">
              <input
                  value={localName}
                  onChange={(e) => setLocalName(e.target.value)}
                  disabled={!isEditing || isReadOnly}
                  className={`text-[#0F0F0F] text-6xl font-bold bg-transparent outline-none border-none p-0 w-full mb-2 ${isEditing && !isReadOnly ? 'border-b border-gray-400 underline' : ''}`}
              />

              {localDescription && (
                  <div className={'text-[#7A7A7A] text-xl w-full relative'}>
                    {localDescription.length > 140 && !isEditing ? (
                        <div>
                          <div
                              className="bg-transparent outline-none border-none resize-none w-full h-auto overflow-hidden font-inherit p-0">
                            {showFullDescription ? localDescription : localDescription.slice(0, 120) + '...'}
                          </div>
                          <a className={'text-[#a7a7a7] text-l cursor-pointer block mt-1 hover:underline'}
                             onClick={() => setShowFullDescription(!showFullDescription)}>
                            {showFullDescription ? '   показати скорочено' : '   показати повністю'}
                          </a>
                        </div>
                    ) : (
                        <textarea
                            value={localDescription}
                            onChange={(e) => setLocalDescription(e.target.value)}
                            disabled={!isEditing || isReadOnly}
                            className={`bg-transparent outline-none border-none resize-none w-full scrollbar-hide p-0 ${isEditing && !isReadOnly ? 'border border-gray-300 rounded p-1 bg-white/5 h-24 overflow-y-auto' : 'h-auto overflow-hidden'}`}
                            rows={isEditing ? 4 : 2}
                        />
                    )}
                  </div>
              )}
            </div>

            {!showFullDescription &&
                <div className={'text-2xl text-[#7A7A7A] flex flex-row gap-3 items-center justify-start mt-auto'}>
                  {type}
                  <div>
                    {!!songsCount && <div className={'flex flex-row items-center gap-2 text-[#7A7A7A]'}>
                      <Dot className={"text-[#7A7A7A]"}/>
                      <div>
                        Треків: {songsCount}
                      </div>
                    </div>}
                    {!!genres && <div className={'flex flex-row items-center gap-2 text-[#7A7A7A]'}>
                      <Dot className={"text-[#7A7A7A]"}/>
                      <div>
                        {genres}
                      </div>
                    </div>
                    }
                  </div>
                </div>}
          </div>
        </div>

        <div className={'flex flex-col items-end justify-between h-60'}>
          {isEditing && !isRelease ? (
              <label className="inline-flex items-center cursor-pointer mt-2">
                        <span className="mr-3 text-xl font-medium text-[#7A7A7A]">
                            {localIsPublic ? 'Публічний' : 'Приватний'}
                        </span>
                <input
                    type="checkbox"
                    checked={localIsPublic}
                    onChange={() => setLocalIsPublic(!localIsPublic)}
                    className="sr-only peer"
                />
                <div
                    className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0F0F0F]"></div>
              </label>
          ) : (
              <button className={'flex flex-row items-end cursor-pointer'}
                      onClick={onRatingClick}>
                {!!avgRating && (
                    <div className={'flex flex-row items-center justify-center text-3xl'}>
                      {avgRating}
                      <div className={'text-xl text-[#7A7A7A]'}>/10</div>
                      <Star className={'w-8.5 '}/>
                    </div>
                )}
              </button>
          )}

          {objectId && (
              <div className="flex flex-row gap-2">
                {isEditing ? (
                    <>
                      <button
                          onClick={handleCancel}
                          className={`px-4 py-2 rounded-lg text-[#7A7A7A] font-medium transition-color hover:bg-gray-50`}
                      >
                        Скасувати
                      </button>

                      <button
                          onClick={onDeleteCollection}
                          className={`px-4 py-2 rounded-lg text-red-500 font-medium transition-color hover:bg-red-50`}
                      >
                        Видалити
                      </button>

                      {!isRelease && (
                          <button
                              onClick={handleEditToggle}
                              className={`bg-[#0F0F0F] text-white font-medium transition-colors hover:bg-gray-800 rounded-lg px-6 py-2`}
                          >
                            Зберегти
                          </button>
                      )}
                    </>
                ) : (
                    <button
                        onClick={handleEditToggle}
                        className={`bg-[#0F0F0F] text-white font-medium transition-colors hover:bg-gray-800 rounded-lg px-6 py-2`}
                    >
                      Редагувати
                    </button>
                )}
              </div>
          )}
        </div>
      </div>
  )
}
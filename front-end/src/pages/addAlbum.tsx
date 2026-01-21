import * as React from "react";
import {useEffect, useState} from "react";
import {useAppDispatch, useAppSelector} from "../hooks/redux.ts";
import {CollectionType, type CreateAlbumInput} from "../types.ts";
import {createAlbum} from "../store/slices/collection.ts";
import {TrackBigCard} from "../components/TrackBigCard.tsx";
import {CustomInput} from "../components/customInput.tsx";
import {CustomButton} from "../components/customButton.tsx";
import {getGenres, selectGenres} from "../store/slices/track.ts";

type TrackItem = {
  id: number;
  file: File | null;
  name: string;
  description: string;
  isExplicit: boolean;
  genreIds: number[];
};

export const AddAlbum = () => {
  const [name, setName] = useState<string>("");
  const [isExplicit, setIsExplicit] = useState<boolean>(false);
  const [description, setDescription] = useState<string>("");
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);

  const dispatch = useAppDispatch();
  const genres = useAppSelector(selectGenres);

  const [tracks, setTracks] = useState<TrackItem[]>([]);

  useEffect(() => {
    dispatch(getGenres());
  }, [dispatch]);

  const onSaveButtonClick = () => {
    const validTracks = tracks.filter(t => t.file !== null);

    if (validTracks.length === 0) {
      alert("Будь ласка, додайте хоча б один трек з аудіофайлом.");
      return;
    }

    const createAlbumPayload: CreateAlbumInput = {
      tracks: validTracks.map((t) => {
        return {
          name: t.name || t.file?.name.replace(/\.[^/.]+$/, "") || "Без назви",
          description: t.description,
          isExplicit: t.isExplicit,
          audioFile: t.file,
          genres: t.genreIds
        }
      }),
      name: name,
      createdAt: new Date(Date.now()).toISOString(),
      type: CollectionType.Album,
      icon: coverFile,
      description: description,
      isPublic: true
    }

    dispatch(createAlbum(createAlbumPayload))
  };

  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setCoverFile(file);
      setCoverPreview(URL.createObjectURL(file));
    }
  };

  const handleAddTrackSlot = () => {
    const newTrack: TrackItem = {
      id: Date.now(),
      file: null,
      name: "",
      description: "",
      isExplicit: false,
      genreIds: []
    };
    setTracks([...tracks, newTrack]);
  };

  const handleTrackFileUpload = (id: number, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setTracks(tracks.map(track =>
          track.id === id
              ? {...track, file: file}
              : track
      ));
    }
  };

  const handleTrackChange = (id: number, field: 'name' | 'description', value: string) => {
    setTracks(tracks.map(track =>
        track.id === id ? {...track, [field]: value} : track
    ));
  };

  const handleTrackExplicitChange = (id: number) => {
    setTracks(tracks.map(track =>
        track.id === id ? {...track, isExplicit: !track.isExplicit} : track
    ));
  };

  const handleTrackGenreToggle = (trackId: number, genreId: number) => {
    setTracks(tracks.map(track => {
      if (track.id !== trackId) return track;
      const newGenres = track.genreIds.includes(genreId)
          ? track.genreIds.filter(id => id !== genreId)
          : [...track.genreIds, genreId];
      return { ...track, genreIds: newGenres };
    }));
  };

  const handleRemoveTrack = (id: number) => {
    setTracks(tracks.filter(t => t.id !== id));
  };

  return (
      <div className={"w-full px-20 flex flex-col items-start justify-start gap-10 pb-20"}>
        <TrackBigCard
            author={"Ви"}
            name={name || "Назва альбома"}
            type={"Альбом"}
            avgRating={"10"}
            className={"w-full"}
            iconLink={coverPreview}
            songsCount={tracks.filter(t => t.file !== null).length}
        />

        <div className={"flex flex-row items-end justify-between gap-4 w-full"}>
          <div className="w-2/3">
            <CustomInput
                label={"Назва"}
                value={name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
            />
          </div>

          <label className="inline-flex items-center cursor-pointer mb-2 select-none">
                <span className="mr-3 text-xl font-medium text-[#7A7A7A]">
                    {isExplicit ? 'Для дорослих' : 'Для всіх'}
                </span>
            <input
                type="checkbox"
                checked={isExplicit}
                onChange={() => setIsExplicit(!isExplicit)}
                className="sr-only peer"
            />
            <div
                className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0F0F0F]"></div>
          </label>
        </div>

        <div className={'text-[#7A7A7A] text-xl w-full relative'}>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Додайте опис..."
                    className={`bg-transparent outline-none border border-gray-300 focus:border-gray-500 rounded p-2 resize-none w-full h-32 scrollbar-hide bg-white/5 placeholder-gray-300 transition-colors`}
                />
        </div>

        <div className="w-full">
          <label className="text-[#0F0F0F] text-xl mb-2 block">Обкладинка альбому</label>
          <label
              className="flex flex-col items-center justify-center w-full h-24 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
            <div className="flex flex-row items-center justify-center pt-5 pb-6 gap-2">
              {coverFile ? (
                  <span className="text-sm text-green-600 font-medium">
                                Обрано: {coverFile.name}
                            </span>
              ) : (
                  <>
                    <svg className="w-8 h-8 text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                    </svg>
                    <p className="text-sm text-gray-500"><span className="font-semibold">Натисніть для завантаження</span></p>
                  </>
              )}
            </div>
            <input type="file" className="hidden" accept="image/*" onChange={handleCoverUpload}/>
          </label>
        </div>

        <div className="w-full flex flex-col gap-4">
          <h2 className="text-[#0F0F0F] text-2xl">Треки</h2>

          {tracks.map((track, index) => (
              <div key={track.id} className="w-full p-4 border border-gray-200 rounded-xl shadow-sm bg-white flex items-start justify-between">
                <div className="flex items-start gap-4 w-full">
                  <div className="text-gray-400 font-medium w-6 pt-3">{index + 1}.</div>

                  {track.file ? (
                      <div className="flex flex-col w-full gap-3">
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <span>Файл: {track.file.name}</span>
                          <span>({(track.file.size / 1024 / 1024).toFixed(2)} MB)</span>
                        </div>

                        <div className="flex flex-row items-end gap-4 w-full">
                          <div className="w-2/3">
                            <CustomInput
                                label="Назва треку"
                                value={track.name}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleTrackChange(track.id, 'name', e.target.value)}
                            />
                          </div>

                          <label className="inline-flex items-center cursor-pointer mb-2 select-none">
                                            <span className="mr-3 text-lg font-medium text-[#7A7A7A]">
                                                {track.isExplicit ? '18+' : 'Для всіх'}
                                            </span>
                            <input
                                type="checkbox"
                                checked={track.isExplicit}
                                onChange={() => handleTrackExplicitChange(track.id)}
                                className="sr-only peer"
                            />
                            <div
                                className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0F0F0F]"></div>
                          </label>
                        </div>

                        <textarea
                            value={track.description}
                            onChange={(e) => handleTrackChange(track.id, 'description', e.target.value)}
                            placeholder="Опис треку (необов'язково)"
                            className={`bg-transparent outline-none border border-gray-300 focus:border-gray-500 rounded p-2 resize-none w-full h-20 scrollbar-hide bg-white/5 placeholder-gray-300 transition-colors`}
                        />

                        <div className="flex flex-wrap gap-2 mt-2">
                          {genres && genres.map((g) => {
                            const gId = g.genreId;
                            const isSelected = track.genreIds.includes(gId);
                            return (
                                <button
                                    key={gId}
                                    onClick={() => handleTrackGenreToggle(track.id, gId)}
                                    className={`px-2 py-1 text-xs border rounded-full transition-colors ${
                                        isSelected ? 'bg-black text-white border-black' : 'bg-white text-gray-600 border-gray-300'
                                    }`}
                                >
                                  {g.name}
                                </button>
                            )
                          })}
                        </div>

                      </div>
                  ) : (
                      <label className="flex-1 cursor-pointer border-2 border-dashed border-gray-300 rounded-lg p-3 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 text-gray-500 h-24">
                        <span>Завантажте файл треку (MP3)</span>
                        <input
                            type="file"
                            accept=".mp3,audio/mpeg"
                            className="hidden"
                            onChange={(e) => handleTrackFileUpload(track.id, e)}
                        />
                      </label>
                  )}
                </div>

                <button
                    onClick={() => handleRemoveTrack(track.id)}
                    className="ml-4 text-gray-400 hover:text-red-500 transition-colors text-2xl pt-2"
                >
                  &times;
                </button>
              </div>
          ))}

          <button
              onClick={handleAddTrackSlot}
              className="w-full h-12 mt-2 rounded-xl border-2 border-dashed border-gray-300 text-gray-400 flex items-center justify-center hover:border-[#0F0F0F] hover:text-[#0F0F0F] transition-all group mb-10"
          >
            <span className="text-3xl leading-none group-hover:scale-110 transition-transform">+</span>
          </button>

          <CustomButton onClick={onSaveButtonClick} label={"Зберегти"}/>
        </div>

      </div>
  )
}
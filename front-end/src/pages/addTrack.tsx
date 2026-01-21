import * as React from "react";
import {useEffect, useState} from "react";
import {useAppDispatch, useAppSelector} from "../hooks/redux.ts";
import {useNavigate} from "react-router";
import type {CreateTrackInput} from "../types.ts";
import {createTrack, getGenres, selectGenres} from "../store/slices/track.ts";
import {TrackBigCard} from "../components/TrackBigCard.tsx";
import {CustomInput} from "../components/customInput.tsx";
import {CustomButton} from "../components/customButton.tsx";

export const AddTrack = () => {
  const [name, setName] = useState<string>("");
  const [isExplicit, setIsExplicit] = useState<boolean>(false);
  const [description, setDescription] = useState<string>("");

  const [selectedGenreIds, setSelectedGenreIds] = useState<number[]>([]);

  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);

  const [audioFile, setAudioFile] = useState<File | null>(null);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const genres = useAppSelector(selectGenres);

  useEffect(() => {
    dispatch(getGenres());
  }, [dispatch]);

  const onSaveButtonClick = () => {
    if (!audioFile || !name) {
      alert("Будь ласка, введіть назву та завантажте аудіофайл.");
      return;
    }

    if (selectedGenreIds.length === 0) {
      alert("Будь ласка, оберіть хоча б один жанр.");
      return;
    }

    const createTrackPayload: CreateTrackInput = {
      name: name,
      description: description,
      isExplicit: isExplicit,
      audioFile: audioFile,
      icon: coverFile,
      releaseDate: new Date(Date.now()).toISOString(),
      genres: selectedGenreIds
    };

    dispatch(createTrack(createTrackPayload));
  };

  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setCoverFile(file);
      setCoverPreview(URL.createObjectURL(file));
    }
  };

  const handleAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAudioFile(e.target.files[0]);
    }
  };

  const toggleGenre = (genreId: number) => {
    if (selectedGenreIds.includes(genreId)) {
      setSelectedGenreIds(prev => prev.filter(id => id !== genreId));
    } else {
      setSelectedGenreIds(prev => [...prev, genreId]);
    }
  };

  return (
      <div className={"w-full px-20 flex flex-col items-center justify-center gap-10 pb-20"}>
        <TrackBigCard
            author={"Ви"}
            name={name || "Назва треку"}
            type={"Сингл"}
            avgRating={"10"}
            className={"w-full"}
            iconLink={coverPreview}
            songsCount={audioFile ? 1 : 0}
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

        <div className="w-full">
          <label className="text-[#0F0F0F] text-xl mb-2 block">Жанри</label>
          <div className="flex flex-wrap gap-2 p-4 border border-gray-300 rounded-lg bg-gray-50 min-h-[60px]">
            {genres && genres.length > 0 ? (
                genres.map((genre) => {
                  const isSelected = selectedGenreIds.includes(genre.genreId);

                  return (
                      <button
                          key={genre.genreId}
                          onClick={() => toggleGenre(genre.genreId)}
                          className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border ${
                              isSelected
                                  ? "bg-[#0F0F0F] text-white border-[#0F0F0F]"
                                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                          }`}
                      >
                        {genre.name}
                      </button>
                  );
                })
            ) : (
                <span className="text-gray-500 text-sm">Список жанрів завантажується...</span>
            )}
          </div>
          <p className="text-sm text-gray-500 mt-1">Оберіть один або кілька жанрів</p>
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
          <label className="text-[#0F0F0F] text-xl mb-2 block">Обкладинка треку</label>
          <label
              className="flex flex-col items-center justify-center w-full h-24 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
            <div className="flex flex-row items-center justify-center pt-5 pb-6 gap-2">
              {coverFile ? (
                  <span className="text-sm text-green-600 font-medium">
                      Обрано: {coverFile.name}
                  </span>
              ) : (
                  <>
                    <svg className="w-8 h-8 text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                         fill="none" viewBox="0 0 20 16">
                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                            d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                    </svg>
                    <p className="text-sm text-gray-500"><span className="font-semibold">Натисніть для завантаження зображення</span>
                    </p>
                  </>
              )}
            </div>
            <input type="file" className="hidden" accept="image/*" onChange={handleCoverUpload}/>
          </label>
        </div>

        <div className="w-full">
          <label className="text-[#0F0F0F] text-xl mb-2 block">Аудіофайл</label>
          <label
              className="flex flex-col items-center justify-center w-full h-24 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
            <div className="flex flex-row items-center justify-center pt-5 pb-6 gap-2">
              {audioFile ? (
                  <div className="flex flex-col items-center">
                    <span className="text-sm text-green-600 font-medium">
                        Файл: {audioFile.name}
                    </span>
                    <span className="text-xs text-gray-500">
                        ({(audioFile.size / 1024 / 1024).toFixed(2)} MB)
                    </span>
                  </div>
              ) : (
                  <>
                    <p className="text-sm text-gray-500"><span
                        className="font-semibold">Натисніть для завантаження MP3</span></p>
                  </>
              )}
            </div>
            <input type="file" className="hidden" accept=".mp3,audio/mpeg" onChange={handleAudioUpload}/>
          </label>
        </div>

        <div className="w-full mt-4">
          <CustomButton onClick={onSaveButtonClick} label={"Зберегти трек"}/>
        </div>

      </div>
  )
}
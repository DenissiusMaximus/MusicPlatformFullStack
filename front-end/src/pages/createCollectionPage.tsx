import {useState} from "react";
import {useAppDispatch} from "../hooks/redux.ts";
import Dot from "../assets/Dot 2.svg?react";
import {useNavigate} from "react-router";
import {CollectionType, type CreateCollectionInput} from "../types.ts";
import {createCollection} from "../store/slices/collection.ts";

export const CreateCollectionPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [name, setName] = useState("Новий плейлист");
  const [description, setDescription] = useState("");
  const [isPublic, setIsPublic] = useState(false);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSave = () => {
    const createCollectionPayload: CreateCollectionInput = {
      name: name,
      description: description,
      isPublic: isPublic,
      icon: imageFile,
      type: CollectionType.Playlist
    }

    dispatch(createCollection(createCollectionPayload))
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
      <div className={`flex flex-row items-start justify-between min-h-60 w-full pr-30 px-20 pt-10`}>
        <div className={'flex flex-row items-start justify-center w-full'}>

          <div className="mr-6 shrink-0">
            <label
                className={`w-70 h-70 rounded-2xl shadow-xl flex items-center justify-center cursor-pointer overflow-hidden relative group bg-gray-100 border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors`}
            >
              {imagePreview ? (
                  <>
                    <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 hidden group-hover:flex items-center justify-center text-white font-medium">
                      Змінити фото
                    </div>
                  </>
              ) : (
                  <div className="text-[#7A7A7A] text-center px-4">
                    <span className="text-4xl block mb-2">+</span>
                    <span>Завантажити фото</span>
                  </div>
              )}

              <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
              />
            </label>
          </div>

          <div className={'flex flex-col items-start justify-between min-h-60 w-full max-w-3xl'}>

            <div className="w-full flex flex-col items-center justify-center">
              <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Назва плейлиста"
                  className={`text-[#0F0F0F] text-6xl font-bold bg-transparent outline-none border-b border-gray-300 focus:border-gray-500 p-0 w-full mb-4 placeholder-gray-300 transition-colors`}
              />

              <div className={'text-[#7A7A7A] text-xl w-full relative'}>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Додайте опис..."
                    className={`bg-transparent outline-none border border-gray-300 focus:border-gray-500 rounded p-2 resize-none w-full h-32 scrollbar-hide bg-white/5 placeholder-gray-300 transition-colors`}
                />
              </div>
            </div>

            <div className={'text-2xl text-[#7A7A7A] flex flex-row gap-3 items-center justify-start mt-auto'}>
              Плейліст
              <Dot className={"text-[#7A7A7A]"}/>
              0 треків
            </div>
          </div>
        </div>

        <div className={'flex flex-col items-end justify-between h-70 min-w-50'}>

          <label className="inline-flex items-center cursor-pointer mt-2 select-none">
                <span className="mr-3 text-xl font-medium text-[#7A7A7A]">
                    {isPublic ? 'Публічний' : 'Приватний'}
                </span>
            <input
                type="checkbox"
                checked={isPublic}
                onChange={() => setIsPublic(!isPublic)}
                className="sr-only peer"
            />
            <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0F0F0F]"></div>
          </label>

          <div className="flex flex-row gap-2 mt-auto">
            <button
                onClick={handleCancel}
                className={`px-4 py-2 rounded-lg text-red-500 font-medium transition-colors hover:bg-red-50`}
            >
              Скасувати
            </button>
            <button
                onClick={handleSave}
                className={`px-6 py-2 rounded-lg bg-[#0F0F0F] text-white font-medium transition-colors hover:bg-gray-800`}
            >
              Зберегти
            </button>
          </div>
        </div>
      </div>
  )
}
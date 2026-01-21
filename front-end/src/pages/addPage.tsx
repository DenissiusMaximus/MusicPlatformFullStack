import {useState} from "react";
import {AddTrack} from "./addTrack.tsx";
import {AddAlbum} from "./addAlbum.tsx";

export const AddPage = () => {
  const [selectedType, setSelectedType] = useState<"album" | "single">("single");

  const handleSelect = (type: "album" | "single") => {
    setSelectedType(type);
  };

  return (<div className={"overflow-y-scroll scrollbar-hide w-full pt-10 px-20 flex flex-col items-center justify-start"}>
    <h1 className="text-[40px] leading-tight text-[#0F0F0F] mb-6 font-normal">
      Додайте власну музику
    </h1>

    <div className="flex flex-row items-center gap-8 mb-8">
      <button
          onClick={() => handleSelect('single')}
          className={`flex flex-row items-center gap-2 text-xl transition-colors outline-none hover:opacity-80 ${
              selectedType === "single" ? 'text-[#0F0F0F]' : 'text-[#9CA3AF]'
          }`}
      >
        Сингл
        <div className="w-1.5 h-1.5 rounded-full bg-[#D1D5DB]"/>
      </button>

      <button
          onClick={() => handleSelect('album')}
          className={`flex flex-row items-center gap-2 text-xl transition-colors outline-none hover:opacity-80 ${
              selectedType === 'album' ? 'text-[#0F0F0F]' : 'text-[#9CA3AF]'
          }`}
      >
        <div className="w-1.5 h-1.5 rounded-full bg-[#D1D5DB]"/>
        Альбом
      </button>
    </div>

    {selectedType === 'single' && <AddTrack/>}
    {selectedType === 'album' && <AddAlbum/>}

  </div>);
};


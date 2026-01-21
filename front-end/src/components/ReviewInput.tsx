import Star from "../assets/Star.svg?react";
import {useState} from "react";

interface ReviewInputProps {
  initialText?: string;
  initialRating?: number | null;
  isReply?: boolean;
  onSubmit: (text: string, rating: number | null) => void;
  onCancel?: () => void;
  onDelete?: () => void;
  submitLabel?: string;
}

export const ReviewInput = ({
                              initialText = "",
                              initialRating = null,
                              isReply = false,
                              onSubmit,
                              onCancel,
                              onDelete,
                              submitLabel = "Відправити"
                            }: ReviewInputProps) => {
  const [text, setText] = useState(initialText);
  const [rating, setRating] = useState<string>(initialRating ? String(initialRating) : "");

  const handleSubmit = () => {
    if (!text.trim()) return;
    onSubmit(text, isReply ? null : (rating ? Number(rating) : null));
    if (!initialText) {
      setText("");
      setRating("");
    }
  };

  return (
      <div className="w-full bg-[#F2F2F2] rounded-2xl p-4 flex flex-col mt-2 mb-2">
        <div className="flex flex-row justify-between items-start mb-2">
          <div className="text-xl font-medium text-[#0F0F0F]">
            {isReply ? "Ваша відповідь" : (initialText ? "Редагувати коментар" : "Додати коментар")}
          </div>

          {!isReply && (
              <div className="flex items-center gap-1">
                <input
                    type="number"
                    max={10}
                    min={1}
                    placeholder=""
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                    className="bg-transparent text-xl text-right w-8 outline-none border-b border-gray-300 focus:border-gray-500 p-0"
                />
                <span className="text-xl text-[#7A7A7A]">/10</span>
                <Star className="w-6 h-6 mb-1"/>
              </div>
          )}
        </div>

        <textarea
            placeholder="Текст коментаря..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full bg-transparent outline-none resize-none text-[#7A7A7A] placeholder-[#7A7A7A] text-lg h-auto min-h-[40px]"
            rows={1}
        />

        <div className="w-full flex justify-end mt-2 gap-2">
          {onDelete && (
              <button
                  onClick={onDelete}
                  className="text-red-500 text-lg font-medium hover:opacity-70 transition-opacity mr-auto"
              >
                Видалити
              </button>
          )}

          {onCancel && (
              <button
                  onClick={onCancel}
                  className="text-[#7A7A7A] text-lg font-medium hover:opacity-70 transition-opacity"
              >
                Скасувати
              </button>
          )}
          <button
              onClick={handleSubmit}
              className="text-[#0F0F0F] text-lg font-medium hover:opacity-70 transition-opacity"
          >
            {submitLabel}
          </button>
        </div>
      </div>
  );
};
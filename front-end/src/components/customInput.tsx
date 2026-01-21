import * as React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  errorLabel?: string;
}

export const CustomInput =
    ({
       label,
       errorLabel,
       placeholder = "",
       type = "text",
       className,
       ...props
     }: InputProps) => {
      return (
          <div className={className}>
            <label className="text-[#7A7A7A] text-xl ml-1 font-medium">
              {label}
            </label>
            <input
                type={type}
                placeholder={placeholder}
                className={`
                    w-full 
                    border border-[#A7A7A7] 
                    rounded-full 
                    px-4 py-1 
                    text-gray-700 
                    placeholder-gray-400 
                    focus:outline-none focus:border-gray-500 
                    transition-colors
                `}
                {...props}
            />
            {errorLabel && (
                <label className="text-red-400 text-l ml-1 font-medium">
                  {errorLabel}
                </label>
            )}
          </div>
      )
    }
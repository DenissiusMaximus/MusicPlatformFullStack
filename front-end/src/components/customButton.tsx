import * as React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
}

export const CustomButton =
    ({
       label,
       className,
       ...props
     }: ButtonProps) => {
      return (
          <button className={`
            w-full 
            rounded-full 
            px-4 py-1 
            border border-transparent
            text-black 
            bg-[#FCFD82]
            focus:bg-[#FEFF6C] 
            h-fit
            cursor-pointer
          ${className}
          `}
                  {...props}
          >
            {label}
          </button>
      )
    }
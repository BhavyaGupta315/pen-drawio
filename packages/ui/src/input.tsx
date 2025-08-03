import React, { JSX } from "react";

interface InputProps {
    label : string;
    type? : string;
    value? : string;
    onChange? : (e : React.ChangeEvent<HTMLInputElement>) => void;
    className? : string;
    bgColor?: string;
}

export default function Input({label, type, value, onChange, className, bgColor} : InputProps) : JSX.Element{
    
    return<div className="w-full max-w-sm min-w-[200px] my-3">
        <div className="relative">
            <input
            id={`customInput${label}`}
            type={type}
            value={value}
            onChange={onChange}
            placeholder=" "
            className={`peer w-full bg-transparent placeholder-transparent ${(bgColor) ? `text-white` : "text-slate-700"} text-sm border border-slate-200 rounded-md px-3 pt-4 pb-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow ${className}`}
            />
            <label
            htmlFor={`customInput${label}`}
            className={`absolute left-3 text-slate-400 ${(bgColor) ? `bg-[${bgColor}]` : "bg-white"} text-sm px-1 transition-all transform origin-left
                ${value ? "-top-2 text-xs" : "top-2.5 text-sm"}
                peer-focus:-top-2 peer-focus:text-xs`}
            >
            {label}
            </label>
        </div>
    </div>


     
}
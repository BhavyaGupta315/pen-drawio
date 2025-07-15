import React, { JSX } from "react";

interface InputProps {
    label : string;
    type? : string;
    value? : string;
    onChange? : (e : React.ChangeEvent<HTMLInputElement>) => void;
    placeholder? : string;
    className? : string;
}

export default function Input({label, type, value, onChange, placeholder, className} : InputProps) : JSX.Element{
    
    return<div className="w-full max-w-sm min-w-[200px] my-3">
                <div className="relative">
                    <input
                        id="customInput"
                        className={`peer w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow ${className}`}
                        type={type}
                        value={value}
                        onChange={onChange}
                        placeholder={placeholder}
                    />
                    <label
                        htmlFor="customInput"
                        className="absolute cursor-text bg-white px-1 left-2.5 top-2.5 text-slate-400 text-sm transition-all transform origin-left peer-focus:-top-2 peer-focus:left-2.5 peer-focus:text-xs peer-focus:text-slate-400 peer-focus:scale-90"
                    >
                    {label}
                    </label>
                </div>
        </div>
     
}
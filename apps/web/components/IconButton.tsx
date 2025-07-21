import { ReactNode } from "react";

export function IconButton({
  icon,
  onClick,
  activated,
}: {
  icon: ReactNode;
  onClick: () => void;
  activated: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-10 h-10 flex items-center justify-center
        rounded-4xl border text-lg cursor-pointer
        transition-all duration-200 ease-out
        ${
            !activated
            ? "bg-neutral-700 text-white border-neutral-800 shadow-md hover:shadow-2xl hover:scale-[1.05]"
            : "bg-white text-gray-700 border-gray-200 hover:bg-gray-100 "
        }`}


    >
      {icon}
    </button>
  );
}

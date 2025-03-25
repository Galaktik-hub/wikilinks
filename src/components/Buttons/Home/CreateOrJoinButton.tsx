import React from "react";
import PlusSVG from "../../../assets/Cards/PlusSVG.tsx";

interface CreateOrJoinButtonProps {
    text: string;
    icon?: string;
    onClick: () => void;
}

export const CreateOrJoinButton: React.FC<CreateOrJoinButtonProps> = ({
    text,
    icon,
    onClick,
}) => {
    return (
        <button
            className="flex gap-1.5 justify-center items-center py-4 mt-2 w-full bg-sky-500 rounded-lg min-h-12 shadow-[0px_0px_6px_rgba(29,151,216,0.5)] max-md:px-5 hover:shadow-[0px_0px_15px_rgba(29,151,216,1)]"
            onClick={onClick}
            type="button"
        >
            {icon && (
                <span className="flex gap-2.5 items-center self-stretch my-auto w-3.5">
                    <span className="flex justify-center items-center self-stretch my-auto w-3.5 min-h-4">
                        <PlusSVG />
                    </span>
                </span>
            )}
            <span className="self-stretch my-auto text-base font-bold text-center text-white">
                {text}
            </span>
        </button>
    );
};

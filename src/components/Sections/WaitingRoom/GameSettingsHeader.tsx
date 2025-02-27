import * as React from "react";
import EditSVG from "../../../assets/WaitingRoom/EditSVG.tsx";

interface GameSettingsHeaderProps {
    onEdit: () => void;
}

export const GameSettingsHeader: React.FC<GameSettingsHeaderProps> = ({ onEdit }) => {
    return (
        <header className="flex gap-10 justify-between items-center w-full">
            <h2 className="self-stretch my-auto text-lg font-bold leading-none text-sky-500">
                Paramètres de la partie
            </h2>
            <button
                onClick={onEdit}
                className="flex items-center gap-1.5 px-3.5 py-1.5 text-sm text-center text-white bg-blue-600 rounded-md w-[70px] hover:bg-blue-700 transition"
            >
                <EditSVG className="w-4 h-4" />
                <span>Edit</span>
            </button>
        </header>
    );
};

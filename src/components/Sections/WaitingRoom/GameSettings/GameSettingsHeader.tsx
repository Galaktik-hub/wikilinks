import * as React from "react";
import EditSVG from "../../../../assets/WaitingRoom/EditSVG.tsx";

interface GameSettingsHeaderProps {
    onEdit: () => void;
    isHost: boolean;
}

export const GameSettingsHeader: React.FC<GameSettingsHeaderProps> = ({onEdit, isHost}) => {
    return (
        <div className="flex gap-10 justify-between items-center w-full">
            <h2 className="blue-title-effect">Paramètres de la partie</h2>
            {isHost && (
                <button
                    onClick={onEdit}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 text-sm text-center text-white bg-blueSecondary hover:bg-blue-900 rounded-md transition">
                    <EditSVG className="w-4 h-4" />
                    <span>Modifier</span>
                </button>
            )}
        </div>
    );
};

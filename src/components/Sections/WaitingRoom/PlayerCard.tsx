"use client";

import * as React from "react";
import CrownIcon from "../../../assets/WaitingRoom/CrownSVG.tsx";
import MoreOptionsIcon from "../../../assets/WaitingRoom/MoreSVG.tsx";
import PlayerSettingsOverlay from "./PlayerSettingsOverlay.tsx";

interface PlayerCardProps {
    playerName: string;
    idAdmin?: boolean;
}

export const PlayerCard: React.FC<PlayerCardProps> = ({ playerName, idAdmin = false }) => {
    const [isPopupOpen, setIsPopupOpen] = React.useState(false);

    const handleMoreClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();
        setIsPopupOpen(true);
    };

    const closePopup = () => {
        setIsPopupOpen(false);
    };

    return (
        <article className="flex gap-10 justify-between items-center py-2 pr-1.5 pl-4 w-full bg-gray-700 rounded min-h-[45px]">
            <div className="flex gap-1.5 items-center self-stretch py-2 my-auto">
                <span className="self-stretch my-auto">{playerName}</span>
                {idAdmin && <CrownIcon className="text-yellow-500" />}
            </div>
            <button onClick={handleMoreClick} className="p-1 rounded hover:bg-gray-600">
                <MoreOptionsIcon className="w-[25px] h-[25px] text-gray-400" />
            </button>

            {/* Popup Modal */}
            {isPopupOpen && (
                <div
                    className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
                    onClick={closePopup}
                >
                    <div
                        className="relative bg-gray-800  rounded-lg shadow-lg"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <PlayerSettingsOverlay muted={false} isAdmin={true} />
                    </div>
                </div>
            )}
        </article>
    );
};

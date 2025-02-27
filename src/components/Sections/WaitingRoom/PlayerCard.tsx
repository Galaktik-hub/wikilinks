"use client";

import * as React from "react";
import CrownIcon from "../../../assets/WaitingRoom/CrownSVG.tsx";
import MoreOptionsIcon from "../../../assets/WaitingRoom/MoreSVG.tsx";

interface PlayerCardProps {
    playerName: string;
    idAdmin?: boolean;
}

export const PlayerCard: React.FC<PlayerCardProps> = ({ playerName, idAdmin = false }) => {
    const handleMoreClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation(); // Empêche la propagation si nécessaire
        console.log(`More options clicked for ${playerName}`);
        // Ajoute ici ton action (menu déroulant, modal, etc.)
    };

    return (
        <article className="flex gap-10 justify-between items-center py-2 pr-1.5 pl-4 w-full bg-gray-700 rounded min-h-[45px]">
            <div className="flex gap-1.5 items-center self-stretch py-2 my-auto">
                <span className="self-stretch my-auto">{playerName}</span>
                {idAdmin && (
                    <CrownIcon className="text-yellow-500" />
                )}
            </div>
            <button onClick={handleMoreClick} className="p-1 rounded hover:bg-gray-600">
                <MoreOptionsIcon className="w-[25px] h-[25px] text-gray-400" />
            </button>
        </article>
    );
};

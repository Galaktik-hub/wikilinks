"use client";

import * as React from "react";
import { PlayerCard } from "./PlayerCard.tsx";

type PlayerListProps = {
    isHost: boolean;
}

export const PlayerList: React.FC<PlayerListProps> = ({ isHost }) => {
    return (
        <div className="card-container whitespace-nowrap">
            <div className="w-full flex justify-start">
                <h2 className="blue-title-effect">
                    Joueurs
                </h2>
            </div>
            <div className="mt-4 w-full text-base leading-none text-white flex flex-wrap justify-center gap-4">
                <PlayerCard playerName="Joueur 1" isPlayerAdmin={true} isHost={isHost} />
                <PlayerCard playerName="Joueur 2" isHost={isHost} />
                <PlayerCard playerName="Joueur 3" isHost={isHost} />
                <PlayerCard playerName="Joueur 4" isHost={isHost} />
                <PlayerCard playerName="Joueur 5" isHost={isHost} />
            </div>
        </div>
    );
};

export default PlayerList;

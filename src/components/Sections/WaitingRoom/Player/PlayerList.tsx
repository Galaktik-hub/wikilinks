"use client";

import * as React from "react";
import { PlayerCard } from "./PlayerCard.tsx";

type PlayerListProps = {
    isHost: boolean;
    players: { username: string; role: string }[];
}

export const PlayerList: React.FC<PlayerListProps> = ({ isHost, players }) => (
    <div className="card-container whitespace-nowrap">
        <div className="w-full flex justify-start">
            <h2 className="blue-title-effect">
                Joueurs
            </h2>
        </div>
        <div className="mt-4 w-full text-base leading-none text-white flex flex-wrap justify-center gap-4">
            {players.map((player) => (
                <PlayerCard playerName={player.username} isPlayerAdmin={player.role === "creator"} isHost={isHost}/>
            ))}
        </div>
    </div>
);

export default PlayerList;

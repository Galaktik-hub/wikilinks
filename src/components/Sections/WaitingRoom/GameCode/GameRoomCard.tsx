"use client";

import * as React from "react";
import { GameCode } from "./GameCode.tsx";
import { PlayerCount } from "./PlayerCount.tsx";

interface GameRoomCardProps {
    codegame: number;
    playerCount: number;
    maxPlayers: number;
}

export const GameRoomCard: React.FC<GameRoomCardProps> = ({ codegame, playerCount, maxPlayers }) => {
    return (
        <div className="card-container whitespace-nowrap">
            <GameCode code={codegame} />
            <PlayerCount playerCount={playerCount} maxPlayers={maxPlayers} />
        </div>
    );
};

export default GameRoomCard;

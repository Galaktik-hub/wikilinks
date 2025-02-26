"use client";

import * as React from "react";
import { GameCode } from "./GameCode";
import { PlayerCount } from "./PlayerCount";

interface GameRoomCardProps {
    codegame: number;
    playerCount: number;
    maxPlayer: number;
}

export const GameRoomCard: React.FC<GameRoomCardProps> = ({ codegame, playerCount, maxPlayer }) => {
    return (
        <article
            className="w-full p-5 whitespace-nowrap bg-gray-800 rounded-lg border-2 border-blue-700 border-solid"
            style={{ borderColor: '#1D4ED8', borderWidth: '5px' }}
        >
            <GameCode code={codegame} />
            <PlayerCount playerCount={playerCount} maxPlayer={maxPlayer} />
        </article>
    );
};

export default GameRoomCard;

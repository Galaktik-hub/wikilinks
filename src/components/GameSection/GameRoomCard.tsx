"use client";

import * as React from "react";
import { GameCode } from "./GameCode";
import { PlayerCount } from "./PlayerCount";

interface GameRoomCardProps {
    codegame: string;
    current: number;
    max: number;
}

export const GameRoomCard: React.FC<GameRoomCardProps> = ({ codegame, current, max }) => {
    return (
        <article
            className="w-full p-5 whitespace-nowrap bg-gray-800 rounded-lg border-2 border-blue-700 border-solid"
            style={{ borderColor: '#1D4ED8', borderWidth: '5px' }}
        >
            <GameCode code={codegame} />
            <PlayerCount current={current} max={max} />
        </article>
    );
};

export default GameRoomCard;

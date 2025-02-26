"use client";

import * as React from "react";
import { GameCode } from "./GameCode";
import { PlayerCount } from "./PlayerCount";
import Container from "../Container.tsx";

interface GameRoomCardProps {
    codegame: number;
    playerCount: number;
    maxPlayers: number;
}

export const GameRoomCard: React.FC<GameRoomCardProps> = ({ codegame, playerCount, maxPlayers }) => {
    return (
        <Container
            className="w-full p-5 whitespace-nowrap"
        >
            <GameCode code={codegame} />
            <PlayerCount playerCount={playerCount} maxPlayers={maxPlayers} />
        </Container>
    );
};

export default GameRoomCard;

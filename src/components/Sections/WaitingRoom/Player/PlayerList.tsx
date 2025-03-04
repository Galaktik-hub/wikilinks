"use client";

import * as React from "react";
import { PlayerCard } from "./PlayerCard.tsx";
import Container from "../../../Container.tsx";

type PlayerListProps = {
    isHost: boolean;
}

export const PlayerList: React.FC<PlayerListProps> = ({ isHost }) => {
    return (
        <Container className="min-w-[360px] whitespace-nowrap">
            <h2
                className="gap-2.5 self-start py-1 text-lg font-bold leading-none text-sky-500 whitespace-nowrap"
                style={{ textShadow: "0px 0px 14px #0ea5e9"}}
            >
                Joueurs
            </h2>
            <div className="mt-4 w-full text-base leading-none text-white flex flex-wrap justify-center gap-4">
                <PlayerCard playerName="Joueur 1" isPlayerAdmin={true} isHost={isHost} />
                <PlayerCard playerName="Joueur 2" isHost={isHost} />
                <PlayerCard playerName="Joueur 3" isHost={isHost} />
                <PlayerCard playerName="Joueur 4" isHost={isHost} />
                <PlayerCard playerName="Joueur 5" isHost={isHost} />
            </div>
        </Container>
    );
};

export default PlayerList;

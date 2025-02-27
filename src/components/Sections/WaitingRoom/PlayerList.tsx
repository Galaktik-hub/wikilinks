"use client";

import * as React from "react";
import { PlayerCard } from "./PlayerCard.tsx";
import Container from "../../Container.tsx";

export const PlayerList: React.FC = () => {
    return (
        <Container  className="w-[360px] whitespace-nowrap mt-3 mb-3">
            <h2 className="gap-2.5 self-start py-1 text-lg font-bold leading-none text-sky-500 whitespace-nowrap">
                Joueurs
            </h2>
            <div className="mt-4 w-full text-base leading-none text-white ">
                <PlayerCard playerName="Joueur 1" idAdmin={true} />
                <div className="mt-3">
                    <PlayerCard playerName="Joueur 2" />
                </div>
                <div className="mt-3">
                    <PlayerCard playerName="Joueur 3" />
                </div>
                <div className="mt-3">
                    <PlayerCard playerName="Joueur 4" />
                </div>
            </div>
        </Container>
    );
};

export default PlayerList;

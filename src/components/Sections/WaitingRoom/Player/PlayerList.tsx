"use client";

import * as React from "react";
import { PlayerCard } from "./PlayerCard.tsx";
import Container from "../../../Container.tsx";

export const PlayerList: React.FC = () => {
    return (
        <Container className="w-full whitespace-nowrap mt-3 mb-3">
            <h2
                className="gap-2.5 self-start py-1 text-lg font-bold leading-none text-sky-500 whitespace-nowrap"
                style={{ textShadow: "0px 0px 14px #0ea5e9"}}
            >
                Joueurs
            </h2>
            <div className="mt-4 w-full text-base leading-none text-white grid grid-cols-1 md:grid-cols-2 gap-4">
                <PlayerCard playerName="Joueur 1" idAdmin={true} />
                <PlayerCard playerName="Joueur 2" />
                <PlayerCard playerName="Joueur 3" />
                <PlayerCard playerName="Joueur 4" />
            </div>
        </Container>
    );
};

export default PlayerList;

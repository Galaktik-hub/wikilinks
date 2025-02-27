"use client";

import * as React from "react";
import { useState } from "react";
import PlayerProgressItem from "./PlayerProgressItem.tsx";
import UpSVG from "../../../assets/Game/UpSVG.tsx";
import Container from "../../Container.tsx";

interface PlayerProgress {
    id: string;
    playerName: string;
    percentage: number;
}

const PlayerProgressPanel: React.FC = () => {
    const [isOpen, setIsOpen] = useState(true);

    const togglePanel = () => {
        setIsOpen(!isOpen);
    };

    // Sample player progress data
    const playerProgress: PlayerProgress[] = [
        { id: "player1", playerName: "Joueur 1", percentage: 75 },
        { id: "player2", playerName: "Joueur 2", percentage: 50 },
        { id: "player3", playerName: "Joueur 3", percentage: 30 },
    ];

    return (
        <Container className="flex flex-col justify-center w-[360px]">
            <div className="flex gap-10 justify-between w-full">
                <button
                    onClick={togglePanel}
                    aria-expanded={isOpen}
                    aria-controls="player-progress-content"
                    className="flex justify-between w-full"
                >
                    <h2
                        className="gap-2.5 self-stretch py-1 text-lg font-bold leading-none text-sky-500 whitespace-nowrap"
                        style={{ textShadow: "0px 0px 14px #0ea5e9" }}
                    >
                        Progression des joueurs
                    </h2>
                    <span
                        className={`flex gap-2.5 min-h-[25px] transform ${isOpen ? "rotate-180" : "rotate-0"} transition-transform duration-[300ms] ease-in-out `}
                    >
                        <UpSVG />
                    </span>
                </button>
            </div>

            {isOpen && (
                <div
                    id="player-progress-content"
                    className="flex flex-col items-center gap-2 self-center mt-2 w-full text-base text-white"
                >
                    {playerProgress.map((player) => (
                        <PlayerProgressItem
                            key={player.id}
                            playerName={player.playerName}
                            percentage={player.percentage}
                        />
                    ))}
                </div>
            )}
        </Container>
    );
};

export default PlayerProgressPanel;
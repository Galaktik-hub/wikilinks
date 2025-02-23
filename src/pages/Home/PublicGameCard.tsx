"use client";
import React from "react";
import { Button } from "./Button";

interface PublicGameCardProps {
    hostName: string;
    playerCount: number;
    maxPlayers: number;
    gameCode: string;
}

export const PublicGameCard: React.FC<PublicGameCardProps> = ({
                                                                  hostName,
                                                                  playerCount,
                                                                  maxPlayers,
                                                                  gameCode,
                                                              }) => {
    const getStatusColor = () => {
        const ratio = playerCount / maxPlayers;
        if (ratio <= 0.5) return "bg-emerald-500";
        return "bg-amber-500";
    };

    return (
        <article className="p-4 w-full bg-gray-800 rounded-xl">
            <div className="flex gap-5 justify-between text-white">
                <h3 className="text-base font-bold leading-none">
                    Partie de {hostName}
                </h3>
                <span
                    className={`px-2 py-2 text-xs whitespace-nowrap ${getStatusColor()} rounded-full`}
                >
          {playerCount}/{maxPlayers}
        </span>
            </div>

            <div className="flex gap-1.5 py-0.5 pr-16 mt-2">
                <p className="text-sm text-gray-400">Code : {gameCode}</p>
                <img
                    loading="lazy"
                    src="https://cdn.builder.io/api/v1/image/assets/TEMP/3a2e82571df067871d129b55fbaf82df32eeb78dc2a5824d75a686669e1b0097"
                    className="object-contain w-4 aspect-square"
                    alt="Copy code"
                />
            </div>

            <Button variant="blue" className="px-16 py-3.5 mt-3 w-full">
                Rejoindre
            </Button>
        </article>
    );
};

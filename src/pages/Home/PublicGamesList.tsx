"use client";
import React from "react";
import { PublicGameCard } from "./PublicGameCard";

export const PublicGamesList: React.FC = () => {
    const games = [
        { hostName: "Pierre", playerCount: 2, maxPlayers: 6, gameCode: "594339" },
        { hostName: "Pierre", playerCount: 5, maxPlayers: 6, gameCode: "594339" },
        { hostName: "Pierre", playerCount: 5, maxPlayers: 6, gameCode: "594339" },
        { hostName: "Pierre", playerCount: 2, maxPlayers: 6, gameCode: "594339" },
    ];

    return (
        <section className="mt-6 w-full">
            <h2 className="text-lg font-bold leading-none text-white">
                Parties publiques
            </h2>
            <div className="flex flex-col gap-5 mt-5">
                {games.map((game, index) => (
                    <PublicGameCard key={index} {...game} />
                ))}
            </div>
        </section>
    );
};

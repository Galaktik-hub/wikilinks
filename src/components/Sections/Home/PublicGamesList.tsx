"use client";
import React from "react";
import { PublicGameCard } from "../../Cards/Home/PublicGameCard.tsx";

export const PublicGamesList: React.FC = () => {
    const games = [
        { hostName: "Pierre", playerCount: 2, maxPlayers: 6, gameCode: "594339" },
        { hostName: "Marie", playerCount: 5, maxPlayers: 6, gameCode: "594339" },
        { hostName: "Jean", playerCount: 5, maxPlayers: 6, gameCode: "594339" },
        { hostName: "Léa", playerCount: 2, maxPlayers: 6, gameCode: "594339" },
    ];

    return (
        <section className="flex flex-col items-center mt-6 w-full">
            <h2 className="text-lg font-bold leading-none text-white">
                Parties publiques
            </h2>
            <div className="flex flex-wrap gap-5 justify-center items-start mt-5 w-full max-md:max-w-full">
                {games.map((game, index) => (
                    <PublicGameCard key={index} {...game} onJoin={() => {}} />
                ))}
            </div>
        </section>
    );
};

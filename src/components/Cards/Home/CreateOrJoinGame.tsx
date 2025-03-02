"use client";

import React from "react";
import { LobbyCard } from "./LobbyCard.tsx";

export const CreateOrJoinGame: React.FC = () => {
    const handleCreateGame = (username: string) => {
        // Handle create game logic
        console.log("Creating game with username:", username);
    };

    const handleJoinGame = (gameCode: string) => {
        // Handle join game logic
        console.log("Joining game with code:", gameCode);
    };

    return (
        <section className="flex flex-wrap gap-4 justify-center items-start">
            <LobbyCard
                inputPlaceholder="Saisissez votre pseudo"
                buttonText="Créer une partie"
                buttonIcon="https://cdn.builder.io/api/v1/image/assets/e6ab143a25b248bb973e7a530dd82ce8/68378a4475fab4eb50cca3b19270fec43cf502ba0270d9a6912d1d072d019a5e?placeholderIfAbsent=true"
                onSubmit={handleCreateGame}
            />
            <LobbyCard
                inputPlaceholder="Entrez le code de la partie"
                buttonText="Rejoindre la partie"
                onSubmit={handleJoinGame}
            />
        </section>
    );
};

export default CreateOrJoinGame;

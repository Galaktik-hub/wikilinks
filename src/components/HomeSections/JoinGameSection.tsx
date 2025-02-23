"use client";
import React from "react";
import { HomeInput } from "../Inputs/HomeInput.tsx";
import { HomeButton } from "../Buttons/HomeButton.tsx";

export const JoinGameSection: React.FC = () => {
    return (
        <section className="p-4 w-full bg-gray-800 rounded-xl border-2 border-blue-700 border-solid max-w-[358px]">
            <HomeInput placeholder="Entrez le code de la partie" />
            <HomeButton variant="primary" className="w-full mt-2 py-4 font-bold">
                Rejoindre la partie
            </HomeButton>
        </section>
    );
};

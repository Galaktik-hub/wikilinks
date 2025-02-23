"use client";
import React from "react";
import { Input } from "./Input";
import { Button } from "./Button";

export const JoinGameSection: React.FC = () => {
    return (
        <section className="p-4 w-full bg-gray-800 rounded-xl border-2 border-blue-700 border-solid max-w-[358px]">
            <Input placeholder="Entrez le code de la partie" />
            <Button variant="primary" className="w-full mt-2 py-4 font-bold">
                Rejoindre la partie
            </Button>
        </section>
    );
};

"use client";
import React from "react";
import { Input } from "./Input";
import { Button } from "./Button";

export const CreateGameSection: React.FC = () => {
    return (
        <section className="p-4 w-full bg-gray-800 rounded-xl border-2 border-blue-700 border-solid max-w-[358px]">
            <Input placeholder="Saisissez votre pseudo" />
            <Button
                variant="primary"
                className="flex gap-1 items-center justify-center w-full mt-2 py-4"
            >
                <img
                    src="https://cdn.builder.io/api/v1/image/assets/TEMP/90287b1a93f7f508123ae8edbac64facd386c89542d155f070ba9f0b86c3159e"
                    className="w-3.5 aspect-[0.87]"
                    alt=""
                />
                <span className="font-bold">Créer une partie</span>
            </Button>
        </section>
    );
};

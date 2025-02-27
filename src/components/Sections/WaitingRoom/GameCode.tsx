"use client";

import * as React from "react";
import CopySVG from "../../../assets/WaitingRoom/CopySVG.tsx";

interface GameCodeProps {
    code: number;
}

export const GameCode: React.FC<GameCodeProps> = ({ code }) => {
    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(code.toString());
        } catch (err) {
            console.error("Failed to copy code:", err);
        }
    };

    return (
        <section className="flex gap-10 justify-between items-start py-1 mt-2 w-full text-base leading-none">
            <h2 className="text-gray-400">Code</h2>
            <button
                onClick={handleCopy}
                className="flex gap-1 items-center text-lg font-bold leading-none text-white"
                aria-label={`Copy game code ${code}`}
            >
                <span className="w-[77px]">{code}</span>
                <CopySVG />
            </button>
        </section>
    );
};

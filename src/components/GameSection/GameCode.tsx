"use client";

import * as React from "react";

interface GameCodeProps {
    code: string;
}

export const GameCode: React.FC<GameCodeProps> = ({ code }) => {
    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(code);
        } catch (err) {
            console.error("Failed to copy code:", err);
        }
    };

    return (
        <section className="flex gap-10 justify-between items-start py-1 mt-2 w-full text-base leading-none bg-black bg-opacity-0">
            <h2 className="text-gray-400">Code</h2>
            <button
                onClick={handleCopy}
                className="flex gap-1 items-center text-lg font-bold leading-none text-white bg-black bg-opacity-0"
                aria-label={`Copy game code ${code}`}
            >
                <span className="w-[77px]">{code}</span>
                <img
                    src="https://cdn.builder.io/api/v1/image/assets/0025ac7cef8d4695ad7481fcf899a24a/5590df18f9d907e0ab33d16faabf0edb723eef77b481379116fc2eda04658c06?placeholderIfAbsent=true"
                    alt="Copy code"
                    className="object-contain w-4 aspect-square"
                />
            </button>
        </section>
    );
};

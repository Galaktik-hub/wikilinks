import * as React from "react";

interface PlayerCountProps {
    current: number;
    max: number;
}

export const PlayerCount: React.FC<PlayerCountProps> = ({ current, max }) => {
    return (
        <section className="flex gap-10 justify-between items-start py-1 mt-2 w-full text-base leading-none bg-black bg-opacity-0">
            <h2 className="text-gray-400">Joueurs</h2>
            <p className="text-emerald-400">
                {current}/{max}
            </p>
        </section>
    );
};

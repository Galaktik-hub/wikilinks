import * as React from "react";

interface PlayerCountProps {
    playerCount: number;
    maxPlayers: number;
}

export const PlayerCount: React.FC<PlayerCountProps> = ({ playerCount, maxPlayers }) => {
    const textColor = playerCount === maxPlayers
        ? "text-red-500"
        : playerCount > maxPlayers / 2
            ? "text-orange-400"
            : "text-emerald-500";
    return (
        <section className="flex gap-10 justify-between items-start py-1 mt-2 w-full text-base leading-none">
            <h2 className="text-gray-400">Joueurs</h2>
            <p className={`${textColor}`}>
                {playerCount}/{maxPlayers}
            </p>
        </section>
    );
};

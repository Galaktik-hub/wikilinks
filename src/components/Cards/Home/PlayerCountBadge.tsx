import React from "react";

interface PlayerCountBadgeProps {
    playerCount: number;
    maxPlayers: number;
}

const PlayerCountBadge: React.FC<PlayerCountBadgeProps> = ({playerCount, maxPlayers}) => {
    const bgColor = playerCount >= maxPlayers ? "bg-red-500" : playerCount > maxPlayers / 2 ? "bg-orange-400" : "bg-emerald-500";
    return (
        <span className={`self-stretch flex justify-center py-1.5 my-auto w-10 text-xs whitespace-nowrap ${bgColor} rounded-full`}>
            {playerCount}/{maxPlayers}
        </span>
    );
};

export default PlayerCountBadge;

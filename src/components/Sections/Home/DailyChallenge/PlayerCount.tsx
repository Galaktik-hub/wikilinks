import React from "react";
import FriendsSVG from "../../../../assets/Home/FriendsSVG.tsx";

interface PlayerCountProps {
    count: number;
}

export const PlayerCount: React.FC<PlayerCountProps> = ({count}) => {
    return (
        <div className="font-inter flex items-center gap-2 text-base md:text-lg">
            <FriendsSVG />
            {count} joueurs y ont déjà joué aujourd'hui
        </div>
    );
};

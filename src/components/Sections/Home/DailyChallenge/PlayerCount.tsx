import React from 'react';

interface PlayerCountProps {
    count: number;
}

export const PlayerCount: React.FC<PlayerCountProps> = ({ count }) => {
    return (
        <div className="flex items-center gap-2 text-base md:text-lg">
            👥 {count} joueurs y ont déjà joué aujourd'hui
        </div>
    );
};

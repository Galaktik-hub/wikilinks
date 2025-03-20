import React from 'react';

interface PlayButtonProps {
    onClick: () => void;
}

export const PlayButton: React.FC<PlayButtonProps> = ({ onClick }) => {
    return (
        <button 
            className="bg-white/20 text-white border-none rounded-lg px-3 md:px-4 py-3 md:py-4 text-base md:text-lg font-bold cursor-pointer transition-colors hover:bg-white/20"
            onClick={onClick}
        >
            Jouez maintenant
        </button>
    );
};

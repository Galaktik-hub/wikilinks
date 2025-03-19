"use client";

import * as React from "react";
import PlaySVG from "../../../assets/WaitingRoom/PlaySVG.tsx";

type LaunchButtonProps = {
    onClick?: () => void;
    disabled?: boolean;
    isHost: boolean;
};

const LaunchButton: React.FC<LaunchButtonProps> = ({ onClick, disabled = false, isHost }) => {
    return (
        <div className="flex justify-center">
            <button
                onClick={isHost ? onClick : undefined}
                disabled={!isHost || disabled}
                className={`w-full flex items-center justify-center text-xl font-bold rounded-lg transition-colors pt-1.5 pb-1.5 pr-5 pl-5
                    ${
                    isHost
                        ? "text-white bg-green-600 shadow-[0px_0px_10px_rgba(16,185,64,0.5)] hover:shadow-[0px_0px_15px_rgba(16,185,64,1)]"
                        : "text-gray-400 bg-gray-700 cursor-not-allowed"
                }`}
                type="button"
                aria-label={isHost ? "Lancer la partie" : "En attente de l'hôte"}
            >
                <span>{isHost ? "Lancer la partie" : "En attente de l'hôte..."}</span>
                {isHost && <PlaySVG className="ml-2 w-6 h-6 text-white" />}
            </button>
        </div>
    );
};

export default LaunchButton;

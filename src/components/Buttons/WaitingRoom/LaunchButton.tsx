"use client";

import * as React from "react";
import PlaySVG from "../../../assets/WaitingRoom/PlaySVG.tsx";
import MainButton from "../MainButton.tsx";

type LaunchButtonProps = {
    onClick?: () => void;
    disabled?: boolean;
    isHost: boolean;
};

const LaunchButton: React.FC<LaunchButtonProps> = ({onClick = () => {}, disabled = false, isHost}) => {
    return (
        <MainButton
            color=""
            onClick={onClick}
            disabled={!isHost || disabled}
            className={`${
                isHost
                    ? "text-white bg-green-600 shadow-[0px_0px_10px_rgba(16,185,64,0.5)] hover:shadow-[0px_0px_15px_rgba(16,185,64,1)]"
                    : "text-gray-400 bg-gray-700 cursor-not-allowed"
            }`}
            ariaLabel={isHost ? "Lancer la partie" : "En attente de l'hôte..."}>
            <span className="text-center text-xl">{isHost ? "Lancer la partie" : "En attente de l'hôte..."}</span>
            {isHost && <PlaySVG className="ml-2 w-6 h-6 text-white" />}
        </MainButton>
    );
};

export default LaunchButton;

"use client";

import * as React from "react";
import PlaySVG from "../../../../assets/WaitingRoom/PlaySVG.tsx";
import MainButton from "../../MainButton.tsx";

type LaunchButtonProps = {
    onLaunch: () => void;
    alreadyPlayed: boolean;
    disabled?: boolean;
};

const LaunchButtonChallenge: React.FC<LaunchButtonProps> = ({ onLaunch, alreadyPlayed, disabled = false }) => {
    const isDisabled = alreadyPlayed || disabled;

    return (
        <MainButton
            color=""
            onClick={() => {
                if (isDisabled) return;
                onLaunch();
            }}
            className={`${
                !isDisabled
                    ? "text-white bg-green-600 shadow-[0px_0px_10px_rgba(16,185,64,0.5)] hover:shadow-[0px_0px_15px_rgba(16,185,64,1)]"
                    : "text-gray-400 bg-gray-700 cursor-not-allowed"
            }`}
            ariaLabel={!alreadyPlayed ? "Jouer le challenge" : "Déjà joué..."}
            disabled={isDisabled}
        >
            <span className="text-center text-xl">
                {!alreadyPlayed ? "Jouer le challenge" : "Déjà joué..."}
            </span>
            {!isDisabled && <PlaySVG className="ml-2 w-6 h-6 text-white" />}
        </MainButton>
    );
};

export default LaunchButtonChallenge;

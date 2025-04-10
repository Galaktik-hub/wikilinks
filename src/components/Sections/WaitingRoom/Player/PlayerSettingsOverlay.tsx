"use client";

import * as React from "react";
import VolumeButton from "../../../Buttons/WaitingRoom/VolumeButton.tsx";
import ExcludeButton from "../../../Buttons/WaitingRoom/ExcludeButton.tsx";

interface PlayerSettingsOverlayProps {
    muted: boolean;
    isHost: boolean;
}

export const PlayerSettingsOverlay: React.FC<PlayerSettingsOverlayProps> = ({isHost}) => {
    return (
        <div className="card-container flex justify-center items-center gap-2.5">
            <div className="flex flex-col justify-between items-center">
                <VolumeButton />
                <p className="w-full text-center text-cyan-400">Muet</p>
            </div>
            {isHost && (
                <div className="flex flex-col justify-between items-center w-[60px]">
                    <ExcludeButton />
                    <p className="w-full text-center text-red-500">Exclure</p>
                </div>
            )}
        </div>
    );
};

export default PlayerSettingsOverlay;

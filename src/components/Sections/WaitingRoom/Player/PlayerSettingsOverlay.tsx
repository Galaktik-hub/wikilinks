"use client";

import * as React from "react";
import Container from "../../../Container.tsx";
import VolumeButton from "../../../Buttons/WaitingRoom/VolumeButton.tsx";
import ExcludeButton from "../../../Buttons/WaitingRoom/ExcludeButton.tsx";

interface PlayerSettingsOverlayProps {
    muted: boolean;
    isAdmin: boolean;
}

export const PlayerSettingsOverlay: React.FC<PlayerSettingsOverlayProps> = ({ isAdmin }) => {
    return (
        <div className="absolute top-[-2rem] left-1/2 -translate-x-1/4 z-50">
            <Container className="whitespace-nowrap p-2 "> {}
                <div className="flex justify-center items-center gap-2.5 w-full">
                    <div className="flex flex-col justify-between items-center">
                        <VolumeButton />
                        <p className="w-full text-center text-cyan-400">Muet</p>
                    </div>
                    {isAdmin && (
                        <div className="flex flex-col justify-between items-center w-[60px]">
                            <ExcludeButton />
                            <p className="w-full text-center text-red-500">Exclure</p>
                        </div>
                    )}
                </div>
            </Container>
        </div>
    );
};

export default PlayerSettingsOverlay;

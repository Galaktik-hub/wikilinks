"use client";

import * as React from "react";
import Container from "../../Container.tsx";
import VolumeButton from "../../Buttons/WaitingRoom/VolumeButton.tsx";
import ExcludeButton from "../../Buttons/WaitingRoom/ExcludeButton.tsx";

interface PlayerSettingsOverlayProps {
    muted: boolean,
    isAdmin: boolean;
}

export const PlayerSettingsOverlay: React.FC<PlayerSettingsOverlayProps> = ({ isAdmin }) => {
    return (
        <Container
            className="whitespace-nowrap"
        >
            <div className="flex justify-center items-center gap-2.5 w-full min-h-[65px]">
                <div className="flex flex-col justify-between items-center w-[60px]">
                    <VolumeButton />
                    <p
                        className="w-full text-center"
                        style={{ color: "#00F7FF" }}
                    >
                        Muet
                    </p>
                </div>
                { isAdmin ? (
                    <div className="flex flex-col justify-between items-center w-[60px]">
                        <ExcludeButton />
                        <p
                            className="w-full text-center"
                            style={{ color: "#EF4444" }}
                        >
                            Exclure
                        </p>
                    </div>
                ) : null}
            </div>

        </Container>
    );
};

export default PlayerSettingsOverlay;

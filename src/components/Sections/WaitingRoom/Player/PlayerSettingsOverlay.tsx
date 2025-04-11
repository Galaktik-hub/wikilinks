"use client";

import * as React from "react";
import VolumeButton from "../../../Buttons/WaitingRoom/VolumeButton.tsx";
import ExcludeButton from "../../../Buttons/WaitingRoom/ExcludeButton.tsx";
import { useContext } from "react";
import { SocketContext } from "../../../../context/SocketContext.tsx";

interface PlayerSettingsOverlayProps {
    muted: boolean;
    onToggleMute: () => void;
    isHost: boolean;
    playerName: string | null | undefined;
}

export const PlayerSettingsOverlay: React.FC<PlayerSettingsOverlayProps> = (props) => {
    const socket = useContext(SocketContext);

    const handleMuteClick = () => {
        socket?.sendMessageToServer({ kind: "mute_player", playerName: props.playerName });
        props.onToggleMute();
    };

    const handleExcludeClick = () => {
        socket?.sendMessageToServer({ kind: "exclude_player", playerName: props.playerName });
    };

    return (
        <div className="card-container flex justify-center items-center gap-2.5">
            <div className="flex flex-col justify-between items-center">
                <VolumeButton muted={props.muted} onClick={handleMuteClick} />
                <p className="w-full text-center text-cyan-400">{props.muted ? "Muet" : "Actif"}</p>
            </div>
            {props.isHost && (
                <div className="flex flex-col justify-between items-center w-[60px]">
                    <ExcludeButton onClick={handleExcludeClick} />
                    <p className="w-full text-center text-red-500">Exclure</p>
                </div>
            )}
        </div>
    );
};

export default PlayerSettingsOverlay;

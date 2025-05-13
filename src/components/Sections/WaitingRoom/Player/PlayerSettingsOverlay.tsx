"use client";

import * as React from "react";
import VolumeButton from "../../../Buttons/WaitingRoom/VolumeButton.tsx";
import ExcludeButton from "../../../Buttons/WaitingRoom/ExcludeButton.tsx";
import {useWebSocket} from "../../../../context/WebSocketContext.tsx";

interface PlayerSettingsOverlayProps {
    muted: boolean;
    onToggleMute: () => void;
    isHost: boolean;
    playerName: string | null | undefined;
}

export const PlayerSettingsOverlay: React.FC<PlayerSettingsOverlayProps> = props => {
    const socketContext = useWebSocket();

    const handleMuteClick = () => {
        socketContext.send({kind: "mute_player", playerName: props.playerName});
        props.onToggleMute();
    };

    const handleExcludeClick = () => {
        socketContext.send({kind: "exclude_player", playerName: props.playerName});
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

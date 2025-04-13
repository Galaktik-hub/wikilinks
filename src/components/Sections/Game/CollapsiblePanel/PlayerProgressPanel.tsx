"use client";

import React, {useContext, useEffect, useState} from "react";
import PlayerProgressItem from "./PlayerProgressItem";
import CollapsiblePanel from "./CollapsiblePanel";
import {SocketContext} from "../../../../context/SocketContext";

export interface TimelineStep {
    id: number;
    type: string;
    data?: Record<string, string>;
}

export interface PlayerProgress {
    id: string;
    playerName: string;
    percentage: number;
    history: TimelineStep[];
}

const PlayerProgressPanel: React.FC = () => {
    const socket = useContext(SocketContext);
    const [playersProgress, setPlayersProgress] = useState<PlayerProgress[]>([]);

    useEffect(() => {
        if (socket && socket.getHistory) {
            socket.getHistory();
        }
    }, []);

    useEffect(() => {
        if (socket) {
            const updatedProgress = socket.players.map((player: {username: string}) => {
                const history = socket.playerHistories[player.username] || [];
                const percentage = history.length; // Temporary percentage calculation
                return {
                    id: player.username,
                    playerName: player.username,
                    percentage,
                    history,
                };
            });
            setPlayersProgress(updatedProgress);
        }
    }, [socket, socket?.players, socket?.playerHistories]);

    return (
        <CollapsiblePanel title="Progression des joueurs" contentId="player-progress-content">
            {playersProgress.map(player => (
                <PlayerProgressItem key={player.id} playerName={player.playerName} percentage={player.percentage} history={[...player.history].reverse()} />
            ))}
        </CollapsiblePanel>
    );
};

export default PlayerProgressPanel;

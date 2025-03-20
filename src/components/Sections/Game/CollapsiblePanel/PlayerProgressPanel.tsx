"use client";

import * as React from "react";
import PlayerProgressItem from "./PlayerProgressItem.tsx";
import CollapsiblePanel from "./CollapsiblePanel.tsx";

interface PlayerProgress {
    id: string;
    playerName: string;
    percentage: number;
}

const PlayerProgressPanel: React.FC = () => {
    const playerProgress: PlayerProgress[] = [
        { id: "player1", playerName: "Joueur 1", percentage: 75 },
        { id: "player2", playerName: "Joueur 2", percentage: 50 },
        { id: "player3", playerName: "Joueur 3", percentage: 30 },
    ];

    return (
        <CollapsiblePanel title="Progression des joueurs" contentId="player-progress-content">
            {playerProgress.map((player) => (
                <PlayerProgressItem
                    key={player.id}
                    playerName={player.playerName}
                    percentage={player.percentage}
                />
            ))}
        </CollapsiblePanel>
    );
};

export default PlayerProgressPanel;

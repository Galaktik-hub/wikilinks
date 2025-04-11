"use client";

import * as React from "react";
import PlayerProgressItem from "./PlayerProgressItem.tsx";
import CollapsiblePanel from "./CollapsiblePanel.tsx";
import {TimelineStep} from "../../../Modals/ModalProps.ts";

interface PlayerProgress {
    id: string;
    playerName: string;
    percentage: number;
    history: TimelineStep[];
}

const PlayerProgressPanel: React.FC = () => {
    const playerProgress: PlayerProgress[] = [
        {
            id: "player1",
            playerName: "Jean",
            percentage: 75,
            history: [
                {id: 1, type: "start"},
                {id: 2, type: "foundArtifact", data: {artefact: "Artefact A"}},
                {id: 3, type: "visitedPage", data: {page_name: "Page A"}},
                {id: 4, type: "visitedPage", data: {page_name: "Page A"}},
                {id: 5, type: "foundPage", data: {page_name: "Page C"}},
                {id: 6, type: "visitedPage", data: {page_name: "Page C"}},
                {id: 7, type: "visitedPage", data: {page_name: "Page C"}},
                {id: 8, type: "visitedPage", data: {page_name: "Page C"}},
                {id: 9, type: "visitedPage", data: {page_name: "Page C"}},
                {id: 10, type: "visitedPage", data: {page_name: "Page C"}},
                {id: 11, type: "visitedPage", data: {page_name: "Page C"}},
                {id: 12, type: "visitedPage", data: {page_name: "Page C"}},
                {id: 13, type: "foundPage", data: {page_name: "Page C"}},
                {id: 14, type: "visitedPage", data: {page_name: "Page C"}},
                {id: 15, type: "visitedPage", data: {page_name: "Page C"}},
            ],
        },
        {
            id: "player2",
            playerName: "Marie",
            percentage: 50,
            history: [
                {id: 1, type: "start"},
                {id: 2, type: "foundArtifact", data: {artefact: "Artefact B"}},
                {id: 3, type: "usedArtifact", data: {artefact: "Artefact B"}},
            ],
        },
        {
            id: "player3",
            playerName: "Paul",
            percentage: 30,
            history: [
                {id: 1, type: "start"},
                {id: 2, type: "foundPage", data: {page_name: "Page C"}},
                {id: 3, type: "visitedPage", data: {page_name: "Page C"}},
            ],
        },
    ];

    return (
        <CollapsiblePanel title="Progression des joueurs" contentId="player-progress-content">
            {playerProgress.map(player => (
                <PlayerProgressItem key={player.id} playerName={player.playerName} percentage={player.percentage} history={player.history.reverse()} />
            ))}
        </CollapsiblePanel>
    );
};

export default PlayerProgressPanel;

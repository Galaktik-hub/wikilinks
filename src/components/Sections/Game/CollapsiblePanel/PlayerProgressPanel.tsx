"use client";

import React, {useEffect, useState} from "react";
import PlayerProgressItem from "./PlayerProgressItem";
import CollapsiblePanel from "./CollapsiblePanel";
import {usePlayersContext} from "../../../../context/PlayersContext.tsx";
import {useGameContext} from "../../../../context/GameContext.tsx";
import {HistoryStep} from "../../../../../packages/shared-types/player/history";

export interface PlayerProgress {
    id: string;
    playerName: string;
    percentage: number;
    history: HistoryStep[];
}

const PlayerProgressPanel: React.FC = () => {
    const playersContext = usePlayersContext();
    const gameContext = useGameContext();
    const [playersProgress, setPlayersProgress] = useState<PlayerProgress[]>([]);

    useEffect(() => {
        if (!gameContext.articles.length)  return;
        playersContext.getHistory();
    }, [gameContext.articles]);

    useEffect(() => {
        const updatedProgress = playersContext.players.map((player: {username: string}) => {
            const history = playersContext.histories[player.username] || [];
            const found = history.filter((step: HistoryStep) => step.type === "foundPage").length;
            const percentage = Math.round((found / gameContext.articles.length) * 100);
            return {
                id: player.username,
                playerName: player.username,
                percentage,
                history,
            };
        });
        setPlayersProgress(updatedProgress);
    }, [playersContext.players, playersContext.histories, gameContext.articles.length]);

    return (
        <CollapsiblePanel title="Progression des joueurs" contentId="player-progress-content">
            {playersProgress.map(player => (
                <PlayerProgressItem key={player.id} playerName={player.playerName} percentage={player.percentage} history={[...player.history].reverse()} />
            ))}
        </CollapsiblePanel>
    );
};

export default PlayerProgressPanel;

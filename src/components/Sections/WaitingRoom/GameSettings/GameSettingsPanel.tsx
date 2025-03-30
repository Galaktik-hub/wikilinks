"use client";
import * as React from "react";
import { GameSettingsHeader } from "./GameSettingsHeader.tsx";
import { GameSettingsParameters } from "./GameSettingsParameters.tsx";
import SettingsGameOverlay from "../PopupSettings/SettingsGameOverlay.tsx";
import {GameSettings} from "../../../../../server/src/game/gameSession.ts";

interface GameSettingsProps {
    isHost: boolean;
    gameSettings: GameSettings;
    setGameSettings: React.Dispatch<React.SetStateAction<GameSettings>>;
}

const GameSettingsPanel: React.FC<GameSettingsProps> = ({ isHost, gameSettings, setGameSettings }) => {
    const [isModalOpen, setIsModalOpen] = React.useState(false);

    const handleEdit = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <div className="card-container whitespace-nowrap">
            <GameSettingsHeader onEdit={handleEdit} isHost={isHost} />
            <GameSettingsParameters
                timeLimit={gameSettings.timeLimit}
                articleCount={gameSettings.numberOfArticles}
                maxPlayers={gameSettings.maxPlayers}
                gameType={gameSettings.type.charAt(0).toUpperCase() + gameSettings.type.slice(1)}
            />

            {/* Modal Popup */}
            {isModalOpen && (
                <SettingsGameOverlay
                    gameSettings={gameSettings}
                    updateGameSettings={setGameSettings}
                    closeModal={closeModal}
                />
            )}
        </div>
    );
};

export default GameSettingsPanel;

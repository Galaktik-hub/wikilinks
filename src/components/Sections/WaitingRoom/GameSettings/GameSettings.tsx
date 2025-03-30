"use client";
import * as React from "react";
import { GameSettingsHeader } from "./GameSettingsHeader.tsx";
import { GameSettingsParameters } from "./GameSettingsParameters.tsx";
import SettingsGameOverlay from "../PopupSettings/SettingsGameOverlay.tsx";

interface GameSettingsProps {
    isHost: boolean;
    gameSettings: {
        timeLimit: number;
        articleCount: number;
        maxPlayers: number;
        isPublicGame: boolean;
    };
    setGameSettings: React.Dispatch<React.SetStateAction<{
        timeLimit: number;
        articleCount: number;
        maxPlayers: number;
        isPublicGame: boolean;
    }>>;
}

const GameSettings: React.FC<GameSettingsProps> = ({ isHost, gameSettings, setGameSettings }) => {
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
                articleCount={gameSettings.articleCount}
                maxPlayers={gameSettings.maxPlayers}
                gameType={gameSettings.isPublicGame ? "Publique" : "Privé"}
            />

            {/* Modal Popup */}
            {isModalOpen && (
                <SettingsGameOverlay
                    timeLimit={gameSettings.timeLimit}
                    articleCount={gameSettings.articleCount}
                    maxPlayers={gameSettings.maxPlayers}
                    isPublicGame={gameSettings.isPublicGame}
                    setTimeLimit={(value) =>
                        setGameSettings((prev) => ({ ...prev, timeLimit: value }))
                    }
                    setArticleCount={(value) =>
                        setGameSettings((prev) => ({ ...prev, articleCount: value }))
                    }
                    setMaxPlayers={(value) =>
                        setGameSettings((prev) => ({ ...prev, maxPlayers: value }))
                    }
                    setIsPublicGame={(value) =>
                        setGameSettings((prev) => ({ ...prev, isPublicGame: value }))
                    }
                    closeModal={closeModal}
                />
            )}
        </div>
    );
};

export default GameSettings;

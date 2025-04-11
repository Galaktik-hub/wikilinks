"use client";
import * as React from "react";
import {GameSettingsHeader} from "./GameSettingsHeader.tsx";
import {GameSettingsParameters} from "./GameSettingsParameters.tsx";
import SettingsGameOverlay from "../PopupSettings/SettingsGameOverlay.tsx";

interface GameSettingsProps {
    isHost: boolean;
    gameSettings: {
        timeLimit: number;
        articleCount: number;
        maxPlayers: number;
        gameType: string;
    };
    setGameSettings: React.Dispatch<
        React.SetStateAction<{
            timeLimit: number;
            articleCount: number;
            maxPlayers: number;
            gameType: string;
        }>
    >;
}

const GameSettings: React.FC<GameSettingsProps> = ({isHost, gameSettings, setGameSettings}) => {
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
                gameType={gameSettings.gameType === "public" ? "Publique" : "Privé"}
            />

            {/* Modal Popup */}
            {isModalOpen && (
                <SettingsGameOverlay
                    timeLimit={gameSettings.timeLimit}
                    articleCount={gameSettings.articleCount}
                    maxPlayers={gameSettings.maxPlayers}
                    gameType={gameSettings.gameType === "public" ? "public" : "private"}
                    setTimeLimit={value => setGameSettings(prev => ({...prev, timeLimit: value}))}
                    setArticleCount={value => setGameSettings(prev => ({...prev, articleCount: value}))}
                    setMaxPlayers={value => setGameSettings(prev => ({...prev, maxPlayers: value}))}
                    setGameType={value => setGameSettings(prev => ({...prev, gameType: value}))}
                    closeModal={closeModal}
                />
            )}
        </div>
    );
};

export default GameSettings;

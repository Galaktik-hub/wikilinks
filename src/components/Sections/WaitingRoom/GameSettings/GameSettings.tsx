"use client";
import * as React from "react";
import {GameSettingsHeader} from "./GameSettingsHeader.tsx";
import {GameSettingsParameters} from "./GameSettingsParameters.tsx";
import SettingsGameOverlay from "../PopupSettings/SettingsGameOverlay.tsx";

export type GameSettingsType = {
    timeLimit: number;
    numberOfArticles: number;
    maxPlayers: number;
    type: "public" | "private";
};

interface GameSettingsProps {
    isHost: boolean;
    gameSettings: GameSettingsType;
    setGameSettings: React.Dispatch<React.SetStateAction<GameSettingsType>>;
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
            <GameSettingsParameters {...gameSettings} />

            {/* Modal Popup */}
            {isModalOpen && <SettingsGameOverlay gameSettings={gameSettings} setGameSettings={setGameSettings} closeModal={closeModal} />}
        </div>
    );
};

export default GameSettings;

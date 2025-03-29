"use client";
import * as React from "react";
import { GameSettingsHeader } from "./GameSettingsHeader.tsx";
import { GameSettingsParameters } from "./GameSettingsParameters.tsx";
import SettingsGameOverlay from "../PopupSettings/SettingsGameOverlay.tsx";

interface GameSettingsProps {
    isHost: boolean;
}

const GameSettings: React.FC<GameSettingsProps> = ({ isHost }) => {
    const [isModalOpen, setIsModalOpen] = React.useState(false);

    const handleEdit = () => {
        setIsModalOpen(true);
        console.log("Edit clicked");
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <div className="card-container whitespace-nowrap">
            <GameSettingsHeader onEdit={handleEdit} isHost={isHost} />
            <GameSettingsParameters
                timeLimit={2}
                articleCount={2}
                maxPlayers={10}
                gameType={"Privé"}
            />

            {/* Modal Popup */}
            {isModalOpen && (
                <SettingsGameOverlay closeModal={closeModal} />
            )}
        </div>
    );
};

export default GameSettings;

"use client";
import * as React from "react";
import { GameSettingsHeader } from "./GameSettingsHeader.tsx";
import { GameSettingsParameters } from "./GameSettingsParameters.tsx";
import SettingsGameOverlay from "./SettingsGameOverlay";
import Container from "../../Container.tsx";

const GameSettings: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = React.useState(false);

    const handleEdit = () => {
        setIsModalOpen(true);
        console.log("Edit clicked");
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <Container className="w-[360px] whitespace-nowrap">
            <GameSettingsHeader onEdit={handleEdit} />
            <GameSettingsParameters
                timeLimit={2}
                articleCount={2}
                maxPlayers={10}
                gameType={"Privé"}
            />

            {/* Modal Popup */}
            {isModalOpen && (
                <div className="fixed top-0 left-0 right-0 flex items-center justify-center bg-opacity-50 z-50">
                    <div className="relative bg-gray-800 mt-4 rounded-lg">
                        {/* Pass closeModal function to SettingsGameOverlay */}
                        <SettingsGameOverlay closeModal={closeModal} />
                    </div>
                </div>
            )}
        </Container>
    );
};

export default GameSettings;

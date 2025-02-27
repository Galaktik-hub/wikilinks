"use client";
import * as React from "react";
import { GameSettingsHeader } from "./GameSettingsHeader.tsx";
import { GameSettingsParameters } from "./GameSettingsParameters.tsx";
import Container from "../../Container.tsx";

const GameSettings: React.FC = () => {
    const handleEdit = () => {
        console.log("Edit clicked");
    };

    return (
        <Container className="w-full whitespace-nowrap">
                <GameSettingsHeader onEdit={handleEdit} />
                <GameSettingsParameters timeLimit={2} articleCount={2} maxPlayers={10} gameType={"Privé"}/>
        </Container>
    );
};

export default GameSettings;

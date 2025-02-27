"use client";
import React from "react";
import Layout from "../components/Layout";
import ObjectivesPanel from "../components/Sections/Game/ObjectivePanel.tsx";
import PlayerProgressPanel from "../components/Sections/Game/PlayerProgressPanel.tsx";

const Game: React.FC = () => {
    return (
        <Layout header={<div/>}>
            <div className="flex flex-col w-full overflow-hidden items-center justify-center p-4">
                <PlayerProgressPanel />
                <ObjectivesPanel />
            </div>
        </Layout>
    );
};

export default Game;

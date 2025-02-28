"use client";
import React from "react";
import Layout from "../components/Layout";
import ObjectivesPanel from "../components/Sections/Game/ObjectivePanel.tsx";
import PlayerProgressPanel from "../components/Sections/Game/PlayerProgressPanel.tsx";
import WikiPagePanel from "../components/Sections/Game/WikiPagePanel.tsx";
import InventaryButton from "../components/Buttons/Game/InventaryButton.tsx";

const Game: React.FC = () => {
    return (
        <Layout header={<div/>}>
            <div className="flex flex-col w-full overflow-hidden items-center justify-center p-4 relative">
                <PlayerProgressPanel />
                <ObjectivesPanel />
                <WikiPagePanel />
                <div
                    className="flex justify-center items-center p-5 bg-red-500 absolute bottom-0 right-0"
                >
                    <InventaryButton />
                </div>
            </div>
        </Layout>
    );
};

export default Game;

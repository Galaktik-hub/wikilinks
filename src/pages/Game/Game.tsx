"use client";
import React from "react";
import Layout from "../../components/Layout";
import ObjectivesPanel from "../../components/Sections/Game/CollapsiblePanel/ObjectivePanel.tsx";
import PlayerProgressPanel from "../../components/Sections/Game/CollapsiblePanel/PlayerProgressPanel.tsx";
import WikiPagePanel from "../../components/Sections/Game/WikiPagePanel.tsx";
import InventoryButton from "../../components/Buttons/Game/InventoryButton.tsx";
import InventoryPanel from "../../components/Sections/Game/Inventory/InventoryPanel.tsx";

const Game: React.FC = () => {
    return (
        <Layout header={<div/>}>
            <div className="flex flex-col w-full h-full overflow-hidden items-center justify-center p-4 relative">
                <PlayerProgressPanel />
                <ObjectivesPanel />
                <WikiPagePanel />
                <div
                    className="md:hidden flex justify-center items-center p-5 absolute bottom-0 right-0"
                >
                    <InventoryButton />
                </div>
            </div>
            <div className="max-w-[769px]:hidden flex w-full justify-center items-center mb-2.5">
                <InventoryPanel gpsCount={5} retourCount={1} mineCount={3} />
            </div>
        </Layout>
    );
};

export default Game;

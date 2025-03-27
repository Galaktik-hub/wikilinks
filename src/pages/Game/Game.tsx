"use client";
import React from "react";
import Layout from "../../components/Layout";
import ObjectivesPanel from "../../components/Sections/Game/CollapsiblePanel/ObjectivePanel.tsx";
import PlayerProgressPanel from "../../components/Sections/Game/CollapsiblePanel/PlayerProgressPanel.tsx";
import WikiPagePanel from "../../components/Sections/Game/WikiPagePanel.tsx";
import InventoryButton from "../../components/Buttons/Game/InventoryButton.tsx";
import InventoryPanel from "../../components/Sections/Game/Inventory/InventoryPanel.tsx";
import ExitButton from "../../components/Buttons/WaitingRoom/ExitButton.tsx";
import TextLoungePanel from "../../components/Sections/WaitingRoom/TextLounge/TextLoungePanel.tsx";
import {useMediaQuery} from "react-responsive";

const Game: React.FC = () => {
    const isMobile = useMediaQuery({ maxWidth: 767 });
    const isDesktop = useMediaQuery({ minWidth: 1200 });
    const isIntermediate = !isMobile && !isDesktop;

    const desktopLeft = (
        <>
            <PlayerProgressPanel />
            <ObjectivesPanel />
            <ExitButton isHost={false} />
        </>
    );

    return (
        <Layout
            header={<div />}
            leftColumn={isDesktop ? desktopLeft : null}
            rightColumn={isDesktop ? <TextLoungePanel /> : null}
        >
            <div className="flex flex-col w-full h-full gap overflow-hidden items-center justify-center p-4 relative gap-5">
                {(isMobile || isIntermediate) && (
                    <>
                        <PlayerProgressPanel />
                        <ObjectivesPanel />
                    </>
                )}
                <WikiPagePanel />
                {(isMobile || isIntermediate) && (
                    <ExitButton isHost={true} />
                )}
            </div>
            {isDesktop && (
                <div className="max-w-[769px]:hidden absolute flex bottom-0 left-1/2 -translate-x-1/2 justify-center items-center mb-2.5">
                    <InventoryPanel gpsCount={5} retourCount={1} mineCount={3} />
                </div>
            )}
            {(!isDesktop) && (
                <>
                    <div className="flex justify-center items-center p-5 absolute bottom-20 right-0">
                        <InventoryButton />
                    </div>
                    <div className="z-50">
                        <TextLoungePanel />
                    </div>
                </>
            )}
        </Layout>
    );
};



export default Game;

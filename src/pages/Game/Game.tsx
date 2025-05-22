"use client";
import React, {useEffect, useState} from "react";
import Layout from "../../components/Layout";
import ObjectivesPanel from "../../components/Sections/Game/CollapsiblePanel/ObjectivePanel.tsx";
import PlayerProgressPanel from "../../components/Sections/Game/CollapsiblePanel/PlayerProgressPanel.tsx";
import WikiPagePanel from "../../components/Sections/Game/WikiPagePanel.tsx";
import InventoryPanel from "../../components/Sections/Game/Inventory/InventoryPanel.tsx";
import ExitButton from "../../components/Buttons/WaitingRoom/ExitButton.tsx";
import TextLoungePanel from "../../components/Sections/WaitingRoom/TextLounge/TextLoungePanel.tsx";
import {useMediaQuery} from "react-responsive";
import InventoryButton from "../../components/Buttons/Game/InventoryButton.tsx";
import Header from "../../components/Header/Header.tsx";
import GameEndScreen from "../../components/Sections/Game/EndGame/GameEndScreen.tsx";
import {useGameContext} from "../../context/GameContext.tsx";

const Game: React.FC = () => {
    const gameContext = useGameContext();
    const [isGameOver, setIsGameOver] = useState(false);

    const isMobile = useMediaQuery({maxWidth: 767});
    const isDesktop = useMediaQuery({minWidth: 1200});
    const isIntermediate = !isMobile && !isDesktop;

    const desktopLeft = (
        <>
            <PlayerProgressPanel />
            <ObjectivesPanel />
            <ExitButton isHost={false} />
        </>
    );

    useEffect(() => {
        setIsGameOver(gameContext.isGameOver);
    }, [gameContext.isGameOver]);

    return (
        <Layout header={<Header />} leftColumn={isDesktop ? desktopLeft : null} rightColumn={isDesktop ? <TextLoungePanel /> : null}>
            {/* Écran de fin de partie */}
            {isGameOver && <GameEndScreen isVisible={isGameOver} endPageToRedirect="result" />}

            <div className="flex flex-col w-full h-full gap overflow-hidden items-center justify-center p-4 relative gap-5">
                {(isMobile || isIntermediate) && (
                    <>
                        <PlayerProgressPanel />
                        <ObjectivesPanel />
                    </>
                )}
                <WikiPagePanel />
                {(isMobile || isIntermediate) && <ExitButton isHost={false} />}
            </div>
            {isDesktop && (
                <div className="max-w-[769px]:hidden absolute flex bottom-0 left-1/2 -translate-x-1/2 justify-center items-center mb-2.5">
                    <InventoryPanel />
                </div>
            )}
            {!isDesktop && (
                <>
                    <div className="flex justify-center items-center p-5 w-full">
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

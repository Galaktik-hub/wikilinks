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
import Timer from "../../components/Timer/Timer";
import {useWebSocket} from "../../context/WebSocketContext";
import LoadingScreen from "../../components/Sections/WaitingRoom/LoadingScreen";

const Game: React.FC = () => {
    const gameContext = useGameContext();
    const socketContext = useWebSocket();
    const [isGameOver, setIsGameOver] = useState(false);
    const [isArtifactLoading, setIsArtifactLoading] = React.useState(false);
    const isHost = gameContext.leaderName === gameContext.username;

    const isMobile = useMediaQuery({maxWidth: 767});
    const isDesktop = useMediaQuery({minWidth: 1200});
    const isIntermediate = !isMobile && !isDesktop;

    const phrases = ["Initialisation du processus", "Lancement du solveur", "Analyse du chemin optimal", "Envoi du résultat"];

    const desktopLeft = (
        <>
            <PlayerProgressPanel />
            <ObjectivesPanel />
            <ExitButton isHost={isHost} />
        </>
    );

    useEffect(() => {
        setIsGameOver(gameContext.isGameOver);
    }, [gameContext.isGameOver]);

    useEffect(() => {
        setIsArtifactLoading(gameContext.artifactLoading);
    }, [gameContext.artifactLoading]);

    const onTimeOver = () => {
        socketContext.send({kind: "time_over"});
    };

    return (
        <>
            <Layout header={<Header />} leftColumn={isDesktop ? desktopLeft : null} rightColumn={isDesktop ? <TextLoungePanel /> : null}>
                {/* If there is a time defined inside the gameContext settings, we put the timer*/}
                {gameContext.settings.timeLimit && gameContext.settings.timeLimit > 0 && (
                    <div className="fixed top-4 left-4 z-50">
                        <Timer handleTimeOver={onTimeOver} />
                    </div>
                )}

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
                    {(isMobile || isIntermediate) && <ExitButton isHost={isHost} />}
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

                {isArtifactLoading && <LoadingScreen title="Chargement de l'artefact" phrases={phrases} />}
            </Layout>
        </>
    );
};

export default Game;

"use client";

import React, {useContext, useEffect, useState} from "react";
import Layout from "../../../components/Layout";
import ObjectivesPanel from "../../../components/Sections/Game/CollapsiblePanel/ObjectivePanel.tsx";
import WikiPagePanel from "../../../components/Sections/Game/WikiPagePanel.tsx";
import ExitButton from "../../../components/Buttons/WaitingRoom/ExitButton.tsx";
import {useMediaQuery} from "react-responsive";
import Header from "../../../components/Header/Header.tsx";
import {SocketContext} from "../../../context/SocketContext.tsx";
import GameEndScreen from "../../../components/Sections/Game/EndGame/GameEndScreen.tsx";

const Game: React.FC = () => {
    const socket = useContext(SocketContext);
    const [isGameEnded, setIsGameEnded] = useState(false);
    const startArticle = socket?.startArticle || "Paris";

    const isMobile = useMediaQuery({maxWidth: 767});
    const isDesktop = useMediaQuery({minWidth: 1200});
    const isIntermediate = !isMobile && !isDesktop;

    const desktopLeft = (
        <>
            <ObjectivesPanel />
            <ExitButton isHost={false} />
        </>
    );

    useEffect(() => {
        // TODO : For test the end screen animation set this at true
        setIsGameEnded(false);
    }, []);

    return (
        <Layout header={<Header />} leftColumn={isDesktop ? desktopLeft : null}>
            {/* Écran de fin de partie */}
            <GameEndScreen isVisible={isGameEnded} />

            <div className="flex flex-col w-full h-full gap overflow-hidden items-center justify-center p-4 relative gap-5">
                {(isMobile || isIntermediate) && <ObjectivesPanel />}
                <WikiPagePanel startArticle={startArticle} />
                {(isMobile || isIntermediate) && <ExitButton isHost={false} />}
            </div>
        </Layout>
    );
};

export default Game;

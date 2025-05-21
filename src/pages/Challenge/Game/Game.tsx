"use client";

import React, {useEffect, useState} from "react";
import Layout from "../../../components/Layout";
import ObjectivesPanel from "../../../components/Sections/Game/CollapsiblePanel/ObjectivePanel.tsx";
import WikiPagePanel from "../../../components/Sections/Game/WikiPagePanel.tsx";
import ExitButton from "../../../components/Buttons/WaitingRoom/ExitButton.tsx";
import {useMediaQuery} from "react-responsive";
import Header from "../../../components/Header/Header.tsx";
import GameEndScreen from "../../../components/Sections/Game/EndGame/GameEndScreen.tsx";
import {useChallengeContext} from "../../../context/ChallengeContext";
import {isAndroid} from "../../../functions/androidCheck";
import {useNavigate} from "react-router-dom";

const Game: React.FC = () => {
    const challengeContext = useChallengeContext();
    const [isGameOver, setIsGameOver] = useState(false);
    const navigate = useNavigate();
    const startArticle = challengeContext.startArticle || "Paris";

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
        if (!isAndroid()) {
            navigate("/");
        }
    }, []);

    useEffect(() => {
        setIsGameOver(challengeContext.isGameOver);
    }, [challengeContext.isGameOver]);

    return (
        <Layout header={<Header />} leftColumn={isDesktop ? desktopLeft : null}>
            {/* Écran de fin de partie */}
            {isGameOver && <GameEndScreen isVisible={isGameOver} endPageToRedirect="challenge" />}

            <div className="flex flex-col w-full h-full gap overflow-hidden items-center justify-center p-4 relative gap-5">
                {(isMobile || isIntermediate) && <ObjectivesPanel />}
                <WikiPagePanel startArticle={startArticle} />
                {(isMobile || isIntermediate) && <ExitButton isHost={false} />}
            </div>
        </Layout>
    );
};

export default Game;

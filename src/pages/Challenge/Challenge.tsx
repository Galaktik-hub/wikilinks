"use client";

import React, {useEffect, useState} from "react";
import Layout from "../../components/Layout.tsx";
import Podium from "../../components/Sections/Result/Podium/Podium.tsx";
import Leaderboard from "../../components/Sections/Result/LeaderBoard/LeaderBoard.tsx";
import Header from "../../components/Header/Header.tsx";
import LaunchButtonChallenge from "../../components/Buttons/Challenge/Game/LaunchButtonChallenge.tsx";
import {useNavigate} from "react-router-dom";
import {isAndroid} from "../../functions/androidCheck.ts";
import {getClosestArticleFromLocation, getLocation} from "../../utils/Location/LocationUtils";
import {useChallengeContext} from "../../context/ChallengeContext";
import ExitButton from "../../components/Buttons/WaitingRoom/ExitButton";
import {useModalContext} from "../../components/Modals/ModalProvider";

export interface ResultProps {
    rank: number;
    name: string;
    score: number;
}

const players: ResultProps[] = [
    {rank: 1, name: "Alex", score: 2450},
    {rank: 2, name: "Maria", score: 2280},
    {rank: 3, name: "John", score: 2150},
    {rank: 4, name: "Joueur 4", score: 2000},
    {rank: 5, name: "Joueur 5", score: 1900},
    {rank: 6, name: "Joueur 6", score: 1800},
    {rank: 7, name: "Lina", score: 1725},
    {rank: 8, name: "David", score: 1650},
    {rank: 9, name: "Sophie", score: 1580},
    {rank: 10, name: "Tom", score: 1500},
    {rank: 11, name: "Emma", score: 1430},
    {rank: 12, name: "Lucas", score: 1370},
    {rank: 13, name: "Chloé", score: 1310},
    {rank: 14, name: "Yann", score: 1250},
    {rank: 15, name: "Inès", score: 1200},
    {rank: 16, name: "Marc", score: 1150},
    {rank: 17, name: "Clara", score: 1100},
    {rank: 18, name: "Romain", score: 1050},
    {rank: 19, name: "Anaïs", score: 1000},
    {rank: 20, name: "Pierre", score: 960},
    {rank: 21, name: "Julie", score: 920},
    {rank: 22, name: "Antoine", score: 890},
    {rank: 23, name: "Lucie", score: 860},
    {rank: 24, name: "Kevin", score: 830},
    {rank: 25, name: "Marine", score: 800},
    {rank: 26, name: "Olivier", score: 770},
    {rank: 27, name: "Eva", score: 740},
    {rank: 28, name: "Thierry", score: 710},
    {rank: 29, name: "Sarah", score: 680},
    {rank: 30, name: "Maxime", score: 650},
];

// Si moins de 3 joueurs, on fournit uniquement ceux nécessaires
const podiumPlayers = players.slice(0, 3);

const Challenge: React.FC = () => {
    const navigate = useNavigate();
    const {openModal, closeModal} = useModalContext();
    const challengeContext = useChallengeContext();
    const alreadyPlayed = false;
    const [targetArticle, setTargetArticle] = useState<string | undefined>(undefined);

    useEffect(() => {
        if (!isAndroid()) {
            navigate("/");
        }

        // We fetch the location to get the closest article from the player
        (async () => {
            try {
                const coords = await getLocation();
                const startArticle = await getClosestArticleFromLocation(coords);
                challengeContext.setStartArticle(startArticle);
                challengeContext.createGame({
                    username: "Joueur 1",
                    startArticle: startArticle,
                });
            } catch (e: any) {
                console.error("Erreur de position :", e);
            }
        })();
    }, []);

    useEffect(() => {
        setTargetArticle(challengeContext.targetArticle);
    }, [challengeContext.targetArticle]);

    const helpMessage = <div>Ceci est le message qui explique le but et règles du jeu du challenge quotidien</div>;

    const handleHelp = async () => {
        openModal({
            title: `Aide - Challenge du jour`,
            type: "confirmation",
            content: {
                message: helpMessage,
                cancelButton: {label: "Retour", onClick: () => closeModal()},
                okButton: {label: "Ok", onClick: () => closeModal()},
            },
        });
    };

    const handleLaunch = () => {
        challengeContext.startGame();
        navigate("/challenge/game");
    };

    return (
        <Layout header={<Header />}>
            <div className="flex flex-col w-full overflow-hidden items-center justify-center p-4 gap-6 max-md:mb-16">
                <div className="title-block flex-col">
                    <div className="relative flex items-center w-full">
                        <h2 className="blue-title-effect w-full text-center">Objectif du jour</h2>
                        <button
                            onClick={handleHelp}
                            className="px-3 py-1 text-center text-white bg-blueSecondary hover:bg-blue-900 transition rounded-full absolute right-0">
                            ?
                        </button>
                    </div>
                    <div className="w-full flex justify-start items-center">
                        <h1 className="text-lg text-white">{targetArticle?.replace(/_/g, " ") ?? "Chargement..."}</h1>
                    </div>
                </div>

                <section className="w-full flex gap-6">
                    <div className="w-full flex flex-col gap-6">
                        <Podium players={podiumPlayers} />
                        <Leaderboard players={players} showCourse={alreadyPlayed} currentPlayerName="Sarah" />
                    </div>
                </section>
                <section className="w-full flex flex-wrap justify-center gap-x-12 gap-y-4 mt-6 max-md:mt-2">
                    <LaunchButtonChallenge onLaunch={handleLaunch} alreadyPlayed={alreadyPlayed} />
                    <ExitButton isHost={false} />
                </section>
            </div>
        </Layout>
    );
};

export default Challenge;

"use client";

import React, {useEffect, useState} from "react";
import Layout from "../../components/Layout.tsx";
import Podium from "../../components/Sections/Result/Podium/Podium.tsx";
import Leaderboard from "../../components/Sections/Result/LeaderBoard/LeaderBoard.tsx";
import Header from "../../components/Header/Header.tsx";
import {useNavigate} from "react-router-dom";
import {isAndroid} from "../../functions/androidCheck.ts";
import {getClosestArticleFromLocation, getLocation} from "../../utils/Location/LocationUtils";
import {useChallengeContext} from "../../context/ChallengeContext";
import ExitButton from "../../components/Buttons/WaitingRoom/ExitButton";
import {useModalContext} from "../../components/Modals/ModalProvider";
import UsernameInput from "../../components/Inputs/Challenge/Username";
import LaunchButtonChallenge from "../../components/Buttons/Challenge/Game/LaunchButtonChallenge.tsx";

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

    const username = challengeContext.username;
    const startArticle = challengeContext.startArticle;

    // 1. Check Android
    useEffect(() => {
        if (!isAndroid()) navigate("/");
    }, []);

    // 2. Fetch location, set article and get today's challenge
    useEffect(() => {
        (async () => {
            try {
                const coords = await getLocation();
                const article = await getClosestArticleFromLocation(coords);
                challengeContext.setStartArticle(article);
                challengeContext.setCurrentTitle(article);
                challengeContext.getTodayChallenge();
            } catch (e: any) {
                console.error("Erreur de position :", e);
            }
        })();
    }, []);

    // 3. Create session once username and startArticle are defined
    useEffect(() => {
        if (username && startArticle) {
            challengeContext.createGame({username, startArticle});
        }
    }, [username, startArticle]);

    // 4. Update targetArticle display
    useEffect(() => {
        setTargetArticle(challengeContext.targetArticle);
    }, [challengeContext.targetArticle]);

    // Disabled until username exists
    const isDisabled = !username;

    const helpMessage =
        "Votre but est de trouver une seule page tirée aléatoirement chaque jour. Vous devez être le plus rapide possible, mais aussi trouver l'article en un minimum de clics. Votre article de départ est le plus proche géographiquement de vous.";

    const handleHelp = () =>
        openModal({
            title: "Aide - Challenge du jour",
            type: "confirmation",
            content: {
                message: helpMessage,
                cancelButton: {label: "Retour", onClick: closeModal},
                okButton: {label: "Ok", onClick: closeModal},
            },
        });

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
                        <button onClick={handleHelp} className="px-2.5 py-0.5 text-white bg-blueSecondary hover:bg-blue-900 rounded-full absolute right-0">
                            ?
                        </button>
                    </div>
                    <div className="w-full flex items-center">
                        <h1 className="text-lg text-white">{targetArticle?.replace(/_/g, " ") ?? "Chargement..."}</h1>
                    </div>
                </div>

                <UsernameInput />

                <section className="w-full flex gap-6">
                    <div className="w-full flex flex-col gap-6">
                        <Podium players={podiumPlayers} />
                        <Leaderboard players={players} showCourse={alreadyPlayed} currentPlayerName={username || ""} />
                    </div>
                </section>

                <section className="w-full flex flex-wrap justify-center gap-x-12 gap-y-4 mt-6 max-md:mt-2">
                    <LaunchButtonChallenge onLaunch={handleLaunch} alreadyPlayed={alreadyPlayed} disabled={isDisabled} />
                    <ExitButton isHost={false} />
                </section>
            </div>
        </Layout>
    );
};

export default Challenge;

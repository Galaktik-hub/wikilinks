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
import {hasPlayedToday} from "../../utils/Challenge/ChallengeUtils";

export interface ResultProps {
    rank: number;
    name: string;
    score: number;
    history: string[];
}

const Challenge: React.FC = () => {
    const navigate = useNavigate();
    const {openModal, closeModal} = useModalContext();
    const challengeContext = useChallengeContext();

    const [targetArticle, setTargetArticle] = useState<string | undefined>(undefined);
    const [podiumPlayers, setPodiumPlayers] = useState<ResultProps[]>([]);
    const [players, setPlayers] = useState<ResultProps[]>([]);

    const [alreadyPlayed, setAlreadyPlayed] = useState<boolean>(false);

    const username = challengeContext.username;
    const startArticle = challengeContext.startArticle;

    // Check Android
    useEffect(() => {
        if (!isAndroid()) navigate("/");
    }, []);

    // Fetch location, set article and get today's challenge
    useEffect(() => {
        (async () => {
            try {
                const coords = await getLocation();
                const article = await getClosestArticleFromLocation(coords);
                challengeContext.setStartArticle(article);
                challengeContext.setCurrentTitle(article);
                challengeContext.getTodayChallenge();
                challengeContext.getTodayLeaderboard();
                const hasPlayed = await hasPlayedToday();
                setAlreadyPlayed(hasPlayed);
            } catch (e: any) {
                console.error("Erreur de position :", e);
            }
        })();
    }, []);

    // Create session once username and startArticle are defined
    useEffect(() => {
        if (username && startArticle) {
            challengeContext.createGame({username, startArticle});
        }
    }, [username, startArticle]);

    // Update targetArticle display
    useEffect(() => {
        setTargetArticle(challengeContext.targetArticle);
    }, [challengeContext.targetArticle]);

    useEffect(() => {
        const leaderboard = challengeContext.leaderboard;
        if (Array.isArray(leaderboard) && leaderboard.length > 0) {
            setPlayers(leaderboard);
            setPodiumPlayers(leaderboard.slice(0, 3));
        } else {
            setPlayers([]);
            setPodiumPlayers([]);
        }
    }, [challengeContext.leaderboard]);

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
                    {players.length > 0 ? (
                        <div className="w-full flex flex-col gap-6">
                            <Podium players={podiumPlayers} />
                            <Leaderboard players={players} showCourse={alreadyPlayed} currentPlayerName={username || ""} />
                        </div>
                    ) : (
                        <p className="w-full text-center text-white">Pas encore de participants pour le leaderboard d'aujourd'hui.</p>
                    )}
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

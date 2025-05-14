"use client";

import React, {useEffect, useState} from "react";
import Layout from "../../components/Layout.tsx";
import Podium from "../../components/Sections/Result/Podium/Podium.tsx";
import TextLoungePanel from "../../components/Sections/WaitingRoom/TextLounge/TextLoungePanel.tsx";
import Leaderboard from "../../components/Sections/Result/LeaderBoard/LeaderBoard.tsx";
import Header from "../../components/Header/Header.tsx";
import ReturnToLobbyButton from "../../components/Buttons/Result/ReturnToLobbyButton.tsx";
import {useGameContext} from "../../context/GameContext.tsx";

export interface ResultProps {
    rank: number;
    name: string;
    score: number;
}

const Result: React.FC = () => {
    const { scoreboard } = useGameContext();
    const [initialized, setInitialized] = useState(false);
    const [podiumPlayers, setPodiumPlayers] = useState<ResultProps[]>([]);
    const [leaderboardPlayers, setLeaderboardPlayers] = useState<ResultProps[]>([]);

    useEffect(() => {
        if (!initialized && scoreboard && scoreboard.size > 0) {
            // Marquer comme initialisé pour ne pas rerun
            setInitialized(true);
            const entries = Array.from(scoreboard.entries());

            // Podium: trois premiers joueurs
            const podium: ResultProps[] = [];
            for (const [rank, names] of entries) {
                for (const name of names) {
                    if (podium.length < 3) {
                        podium.push({ rank, name, score: rank });
                    }
                }
                if (podium.length >= 3) break;
            }
            setPodiumPlayers(podium);

            // Leaderboard complet dans l'ordre existant
            const fullBoard: ResultProps[] = [];
            for (const [rank, names] of entries) {
                for (const name of names) {
                    fullBoard.push({ rank, name, score: rank });
                }
            }
            setLeaderboardPlayers(fullBoard);
        }
    }, [scoreboard, initialized]);

    // On attend le scoreboard
    if (!initialized) return null;

    return (
        <Layout header={<Header />}>
            <div className="flex flex-col w-full overflow-hidden items-center justify-center p-4 gap-6 max-md:mb-16">
                <div className="title-block">Résultats</div>
                <section className="w-full flex gap-6">
                    <div className="w-full flex flex-col gap-6">
                        <Podium players={podiumPlayers} />
                        <Leaderboard players={leaderboardPlayers} showCourse={false} />
                    </div>
                    <div className="hidden xl-custom:flex w-full max-h-[633px] flex-col gap-6">
                        <TextLoungePanel />
                    </div>
                </section>
                <section className="w-full flex justify-center">
                    <ReturnToLobbyButton />
                </section>
            </div>
            <div className="xl-custom:hidden">
                <TextLoungePanel />
            </div>
        </Layout>
    );
};

export default Result;

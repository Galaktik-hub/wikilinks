"use client";

import React from "react";
import Layout from "../../components/Layout.tsx";
import Podium from "../../components/Sections/Result/Podium/Podium.tsx";
import Leaderboard from "../../components/Sections/Result/LeaderBoard/LeaderBoard.tsx";
import Header from "../../components/Header/Header.tsx";
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
];

// Si moins de 3 joueurs, on fournit uniquement ceux nécessaires
const podiumPlayers = players.slice(0, 3);

const Challenge: React.FC = () => {
    const alreadyPlayed = true;

    const handleLaunch = () => {
        console.log("Launch clicked");
    };

    return (
        <Layout header={<Header />}>
            <div className="flex flex-col w-full overflow-hidden items-center justify-center p-4 gap-6 max-md:mb-16">
                <div className="title-block flex-col">
                    <h2 className="blue-title-effect w-full text-center">Objectif du jour</h2>
                    <div className="w-full flex justify-start items-center">
                        <h1 className="text-lg text-white">Page X</h1>
                    </div>
                </div>
                <section className="w-full flex gap-6">
                    <div className="w-full flex flex-col gap-6">
                        <Podium players={podiumPlayers} />
                        <Leaderboard players={players} showCourse={alreadyPlayed} />
                    </div>
                </section>
                <section className="w-full flex justify-center">
                    <LaunchButtonChallenge onLaunch={handleLaunch} alreadyPlayed={alreadyPlayed} />
                </section>
            </div>
        </Layout>
    );
};

export default Challenge;

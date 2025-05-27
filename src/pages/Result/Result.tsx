"use client";

import React, {useEffect} from "react";
import Layout from "../../components/Layout.tsx";
import Podium from "../../components/Sections/Result/Podium/Podium.tsx";
import TextLoungePanel from "../../components/Sections/WaitingRoom/TextLounge/TextLoungePanel.tsx";
import Leaderboard from "../../components/Sections/Result/LeaderBoard/LeaderBoard.tsx";
import Header from "../../components/Header/Header.tsx";
import ReturnToLobbyButton from "../../components/Buttons/Result/ReturnToLobbyButton.tsx";
import {useGameContext} from "../../context/GameContext.tsx";
import {ResultProps} from "../Challenge/Challenge";
import {useAudio} from "../../context/AudioContext";

const Result: React.FC = () => {
    const {username, scoreboard} = useGameContext();
    const {playEffect} = useAudio();

    useEffect(() => {
        const playerResult = scoreboard.find((player: any) => player.name === username);
        if (playerResult && playerResult.rank === 1) {
            playEffect("victory");
        } else {
            playEffect("defeat");
        }
    }, []);

    if (scoreboard.length === 0) {
        return (
            <Layout header={<Header />}>
                <div className="flex items-center justify-center h-full">
                    {/* A spinner could be implemented here */}
                    <p>Chargement des résultats...</p>
                </div>
            </Layout>
        );
    }

    const podiumPlayers: ResultProps[] = scoreboard
        .filter(p => p.rank >= 1 && p.rank <= 3)
        // en cas d’ex æquo, plusieurs même rang
        .sort((a, b) => a.rank - b.rank);

    return (
        <Layout header={<Header />}>
            <div className="flex flex-col w-full overflow-hidden items-center justify-center p-4 gap-6 max-md:mb-16">
                <div className="title-block">Résultats</div>
                <section className="w-full flex gap-6">
                    <div className="w-full flex flex-col gap-6">
                        <Podium players={podiumPlayers} />
                        <Leaderboard players={scoreboard} showCourse={false} currentPlayerName={username as string} />
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

"use client";

import React from "react";
import Layout from "../../components/Layout.tsx";
import Title from "../../components/Sections/WaitingRoom/TitleParty/Title.tsx";
import GameRoomCard from "../../components/Sections/WaitingRoom/GameCode/GameRoomCard.tsx";
import ExitButton from "../../components/Buttons/WaitingRoom/ExitButton.tsx";
import LaunchButton from "../../components/Buttons/WaitingRoom/LaunchButton.tsx";
import GameSettings from "../../components/Sections/WaitingRoom/GameSettings/GameSettings.tsx";
import PlayerList from "../../components/Sections/WaitingRoom/Player/PlayerList.tsx";
import TextLoungePanel from "../../components/Sections/WaitingRoom/TextLounge/TextLoungePanel.tsx";

const isHost: boolean = false;

const WaitingRoom: React.FC = () => {
    return (
        <Layout header={<div />}>
            <div className="flex flex-col w-full overflow-hidden items-center justify-center p-4 gap-6 max-md:mb-16">
                <Title playerName={"Pierre"} />
                <section className="w-full flex gap-6">
                    <div className="w-full flex flex-col gap-6">
                        <GameRoomCard codegame={123456} playerCount={4} maxPlayers={10} />
                        <GameSettings isHost={isHost} />
                        <PlayerList isHost={isHost} />
                    </div>
                    <div className="hidden xl-custom:flex w-full flex-col gap-6">
                        <TextLoungePanel />
                    </div>
                </section>
                <section className="w-full flex flex-wrap-reverse justify-center gap-x-6">
                    <ExitButton isHost={isHost} />
                    <LaunchButton isHost={isHost} />
                </section>
            </div>

            {/* Mobile version of the chat */}
            <div className="xl-custom:hidden">
                <TextLoungePanel />
            </div>
        </Layout>
    );
};

export default WaitingRoom;

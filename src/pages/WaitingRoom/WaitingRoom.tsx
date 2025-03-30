"use client";

import React, {useContext} from "react";
import Layout from "../../components/Layout.tsx";
import GameRoomCard from "../../components/Sections/WaitingRoom/GameCode/GameRoomCard.tsx";
import ExitButton from "../../components/Buttons/WaitingRoom/ExitButton.tsx";
import LaunchButton from "../../components/Buttons/WaitingRoom/LaunchButton.tsx";
import GameSettings from "../../components/Sections/WaitingRoom/GameSettings/GameSettings.tsx";
import PlayerList from "../../components/Sections/WaitingRoom/Player/PlayerList.tsx";
import TextLoungePanel from "../../components/Sections/WaitingRoom/TextLounge/TextLoungePanel.tsx";
import Header from "../../components/Header/Header.tsx";
import {SocketContext} from "../../context/SocketContext.tsx";

const isHost: boolean = true;

const WaitingRoom: React.FC = () => {
    const socket = useContext(SocketContext);

    return (
        <Layout header={<Header />}>
            <div className="flex flex-col w-full overflow-hidden items-center justify-center p-4 gap-6 max-md:mb-16">
                <div className="title-block">
                    Partie de {socket?.username}
                </div>
                <section className="w-full flex gap-6">
                    <div className="w-full flex flex-col gap-6">
                        {/* Conversion du roomCode en nombre avant de le passer en prop */}
                        <GameRoomCard codegame={parseInt(socket?.roomCode as string, 10)} playerCount={4} maxPlayers={10} />
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
            {/* Version mobile du chat */}
            <div className="xl-custom:hidden">
                <TextLoungePanel />
            </div>
        </Layout>
    );
};

export default WaitingRoom;

"use client";

import React, {useContext, useEffect, useRef} from "react";
import Layout from "../../components/Layout.tsx";
import GameRoomCard from "../../components/Sections/WaitingRoom/GameCode/GameRoomCard.tsx";
import ExitButton from "../../components/Buttons/WaitingRoom/ExitButton.tsx";
import LaunchButton from "../../components/Buttons/WaitingRoom/LaunchButton.tsx";
import GameSettingsPanel from "../../components/Sections/WaitingRoom/GameSettings/GameSettingsPanel.tsx";
import {GameSettings} from "../../../server/src/game/gameSettings.ts";
import PlayerList from "../../components/Sections/WaitingRoom/Player/PlayerList.tsx";
import TextLoungePanel from "../../components/Sections/WaitingRoom/TextLounge/TextLoungePanel.tsx";
import Header from "../../components/Header/Header.tsx";
import { SocketContext } from "../../context/SocketContext.tsx";

const WaitingRoom: React.FC = () => {
    const socket = useContext(SocketContext);
    const leftRef = useRef<HTMLDivElement>(null);
    const rightRef = useRef<HTMLDivElement>(null);
    const isHost: boolean = socket?.leaderName === socket?.username;

    const [gameSettings, setGameSettings] = React.useState<GameSettings>({ timeLimit: 10, numberOfArticles: 4, maxPlayers: 10, type: 'private' });

    const [code, setCode] = React.useState<number>(socket?.roomCode || -10);

    useEffect(() => {
        if (socket?.roomCode) {
            setCode(socket.roomCode);
        }
    }, [socket?.roomCode]);

    useEffect(() => {
        if (socket?.gameSettings) {
            setGameSettings({
                timeLimit: socket.gameSettings.timeLimit,
                numberOfArticles: socket.gameSettings.numberOfArticles,
                maxPlayers: socket.gameSettings.maxPlayers,
                type: socket.gameSettings.type
            });
        }
    }, [socket?.gameSettings]);

    useEffect(() => {
        const updateHeights = () => {
            if (leftRef.current && rightRef.current) {
                const leftHeight = leftRef.current.offsetHeight;
                const rightHeight = rightRef.current.offsetHeight;
                const maxHeight = Math.max(leftHeight, rightHeight);
                leftRef.current.style.height = `${maxHeight}px`;
                rightRef.current.style.height = `${maxHeight}px`;
            }
        };
        updateHeights();
        window.addEventListener("resize", updateHeights);
        return () => window.removeEventListener("resize", updateHeights);
    }, []);

    return (
        <Layout header={<Header />}>
            <div className="flex flex-col w-full overflow-hidden items-center justify-center p-4 gap-6 max-md:mb-16">
                <div className="title-block">
                    Partie de {socket?.leaderName}
                </div>
                <section className="w-full h-full flex gap-6">
                    <div ref={leftRef} className="w-full flex flex-col gap-6">
                        <GameRoomCard codegame={code} playerCount={4} maxPlayers={gameSettings.maxPlayers} />
                        <GameSettingsPanel isHost={isHost} gameSettings={gameSettings} setGameSettings={setGameSettings} />
                        <PlayerList isHost={isHost} />
                    </div>
                    <div ref={rightRef} className="hidden xl-custom:flex w-full flex-col gap-6">
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

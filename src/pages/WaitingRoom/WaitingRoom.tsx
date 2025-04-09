"use client";

import React, { useContext, useEffect, useRef } from "react";
import Layout from "../../components/Layout.tsx";
import GameRoomCard from "../../components/Sections/WaitingRoom/GameCode/GameRoomCard.tsx";
import ExitButton from "../../components/Buttons/WaitingRoom/ExitButton.tsx";
import LaunchButton from "../../components/Buttons/WaitingRoom/LaunchButton.tsx";
import GameSettings from "../../components/Sections/WaitingRoom/GameSettings/GameSettings.tsx";
import PlayerList from "../../components/Sections/WaitingRoom/Player/PlayerList.tsx";
import TextLoungePanel from "../../components/Sections/WaitingRoom/TextLounge/TextLoungePanel.tsx";
import Header from "../../components/Header/Header.tsx";
import { SocketContext } from "../../context/SocketContext.tsx";

const WaitingRoom: React.FC = () => {
    const socket = useContext(SocketContext);
    const leftRef = useRef<HTMLDivElement>(null);
    const rightRef = useRef<HTMLDivElement>(null);
    const isHost: boolean = socket?.leaderName === socket?.username;

    const [gameSettings, setGameSettings] = React.useState({
        timeLimit: socket?.gameTimeLimit || 10,
        articleCount: socket?.gameNumberOfArticles || 4,
        maxPlayers: socket?.gameMaxPlayers || 10,
        gameType: socket?.gameType || "private",
    });

    const [code, setCode] = React.useState<number>(socket?.roomCode || -10);
    const [players, setPlayers] = React.useState(socket?.players || []);


    useEffect(() => {
        if (socket?.roomCode) {
            setCode(socket.roomCode);
        }
    }, [socket?.roomCode]);

    useEffect(() => {
        if (socket?.players) {
            setPlayers(socket.players);
        }
    }, [socket?.players]);


    useEffect(() => {
        if (socket?.gameTimeLimit && socket?.gameNumberOfArticles && socket?.gameMaxPlayers && socket?.gameType) {
            setGameSettings({
                timeLimit: socket.gameTimeLimit,
                articleCount: socket.gameNumberOfArticles,
                maxPlayers: socket.gameMaxPlayers,
                gameType: socket.gameType,
            });
        }
    }, [socket?.gameTimeLimit, socket?.gameNumberOfArticles, socket?.gameMaxPlayers, socket?.gameType]);

    useEffect(() => {
        const updateHeights = () => {
            if (leftRef.current && rightRef.current) {
                // Reset heights before measuring to prevent compounding
                leftRef.current.style.height = 'auto';
                rightRef.current.style.height = 'auto';
                
                // Wait for next frame to ensure DOM has updated
                setTimeout(() => {
                    if (leftRef.current && rightRef.current) {
                        // Get the height of the left container
                        const leftHeight = leftRef.current.getBoundingClientRect().height;
                        // Set the right container to match
                        rightRef.current.style.height = `${leftHeight}px`;
                    }
                }, 0);
            }
        };
        
        // Initial update and setup resize listener
        updateHeights();
        window.addEventListener("resize", updateHeights);
        
        // Update heights when players or game settings change
        const observer = new MutationObserver(() => {
            // Add a small delay to ensure DOM is fully updated
            setTimeout(updateHeights, 100);
        });
        
        if (leftRef.current) {
            observer.observe(leftRef.current, { childList: true, subtree: true });
        }
        
        return () => {
            window.removeEventListener("resize", updateHeights);
            observer.disconnect();
        };
    }, [players, gameSettings]);

    return (
        <Layout header={<Header />}>
            <div className="flex flex-col w-full overflow-hidden items-center justify-center p-4 gap-6 max-md:mb-16">
                <div className="title-block">
                    Partie de {socket?.leaderName}
                </div>
                <section className="w-full flex gap-6">
                    <div ref={leftRef} className="w-full flex flex-col gap-6 overflow-y-auto">
                        <GameRoomCard codegame={code} playerCount={players.length} maxPlayers={gameSettings.maxPlayers} />
                        <GameSettings isHost={isHost} gameSettings={gameSettings} setGameSettings={setGameSettings} />
                        <PlayerList isHost={isHost} players={players} />
                    </div>
                    <div ref={rightRef} className="hidden xl-custom:flex w-full flex-col gap-6 overflow-y-auto">
                        <TextLoungePanel />
                    </div>
                </section>
                <section className="w-full flex flex-wrap-reverse justify-center gap-x-12 mt-8">
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

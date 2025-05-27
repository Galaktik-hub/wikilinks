"use client";

import React, {useEffect, useRef} from "react";
import Layout from "../../components/Layout.tsx";
import GameRoomCard from "../../components/Sections/WaitingRoom/GameCode/GameRoomCard.tsx";
import ExitButton from "../../components/Buttons/WaitingRoom/ExitButton.tsx";
import LaunchButtonGame from "../../components/Buttons/WaitingRoom/LaunchButtonGame.tsx";
import GameSettings from "../../components/Sections/WaitingRoom/GameSettings/GameSettings.tsx";
import PlayerList from "../../components/Sections/WaitingRoom/Player/PlayerList.tsx";
import TextLoungePanel from "../../components/Sections/WaitingRoom/TextLounge/TextLoungePanel.tsx";
import Header from "../../components/Header/Header.tsx";
import {useNavigate} from "react-router-dom";
import LoadingScreen from "../../components/Sections/WaitingRoom/LoadingScreen.tsx";
import {useWebSocket} from "../../context/WebSocketContext.tsx";
import {useGameContext} from "../../context/GameContext.tsx";
import {usePlayersContext} from "../../context/PlayersContext.tsx";
import {useAudio} from "../../context/AudioContext";

const WaitingRoom: React.FC = () => {
    const socketContext = useWebSocket();
    const gameContext = useGameContext();
    const playersContext = usePlayersContext();
    const {playEffect} = useAudio();
    const leftRef = useRef<HTMLDivElement>(null);
    const rightRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();
    const isHost: boolean = gameContext.leaderName === gameContext.username;
    const [isLaunched, setIsLaunched] = React.useState(false);

    const [gameSettings, setGameSettings] = React.useState(gameContext.settings);

    const [code, setCode] = React.useState<number>(gameContext.roomCode);
    const [players, setPlayers] = React.useState(playersContext.players);

    useEffect(() => {
        setCode(gameContext.roomCode);
    }, [gameContext.roomCode]);

    useEffect(() => {
        setPlayers(playersContext.players);
    }, [playersContext.players]);

    useEffect(() => {
        // Check if the properties exist, check if the time is not undefined and not 0 (false) js boolean
        setGameSettings(gameContext.settings);
    }, [gameContext.settings]);

    useEffect(() => {
        const updateHeights = () => {
            if (leftRef.current && rightRef.current) {
                const leftHeight = leftRef.current.getBoundingClientRect().height;
                const minHeight = 300; // Hauteur minimale pour le chat
                rightRef.current.style.height = `${Math.max(leftHeight, minHeight)}px`;
            }
        };

        updateHeights();
        window.addEventListener("resize", updateHeights);
        return () => {
            window.removeEventListener("resize", updateHeights);
        };
    }, [players, gameSettings]);

    const handleLaunchClick = () => {
        if (isHost) {
            socketContext.send({kind: "start_game"});
        }
    };

    useEffect(() => {
        if (gameContext.loadingGame) {
            setIsLaunched(true);
            playEffect("startGame");
        }
    }, [gameContext.loadingGame]);

    useEffect(() => {
        if (gameContext.startArticle) {
            setIsLaunched(false);
            navigate("/game");
        }
    }, [gameContext.startArticle, navigate]);

    return (
        <Layout header={<Header />}>
            <div className="flex flex-col w-full overflow-hidden items-center justify-center p-4 gap-6 max-md:mb-16">
                <div className="title-block">Partie de {gameContext.leaderName}</div>
                <section className="w-full flex gap-6">
                    <div ref={leftRef} className="w-full flex flex-col gap-6 overflow-y-auto">
                        <GameRoomCard codegame={code} playerCount={players.length} maxPlayers={gameSettings.maxPlayers} />
                        <GameSettings isHost={isHost} gameSettings={gameSettings} setGameSettings={setGameSettings} />
                        <PlayerList isHost={isHost} players={players} currentUsername={gameContext.username} />
                    </div>
                    <div ref={rightRef} className="hidden xl-custom:flex w-full flex-col gap-6 overflow-y-auto">
                        <TextLoungePanel />
                    </div>
                </section>
                <section className="w-full flex flex-wrap-reverse justify-center gap-x-12 gap-y-4 mt-6 max-md:mt-2">
                    <ExitButton isHost={isHost} />
                    <LaunchButtonGame isHost={isHost} onLaunch={handleLaunchClick} />
                </section>
            </div>
            {/* Version mobile du chat */}
            <div className="xl-custom:hidden">
                <TextLoungePanel />
            </div>
            {isLaunched && <LoadingScreen />}
        </Layout>
    );
};

export default WaitingRoom;

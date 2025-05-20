"use client";

import React, {createContext, useContext, useEffect, useState} from "react";
import {useWebSocket} from "./WebSocketContext.tsx";
import {GameSettingsType} from "../components/Sections/WaitingRoom/GameSettings/GameSettings.tsx";
import {ResultProps} from "../pages/Result/Result.tsx";
import {usePopup} from "./PopupContext.tsx";
import {artifactDefinitions} from "../../server/src/player/inventory/inventoryProps.ts";

interface Article {
    name: string;
    found: boolean;
}

export interface GameContextType {
    // connection/session
    leaderName: string | null;
    username: string | null;
    roomCode: number;
    loadingGame: boolean;

    // settings
    settings: GameSettingsType;
    updateSettings: (payload: GameSettingsType) => void;

    // articles
    startArticle: string;
    articles: Article[];
    currentTitle: string;
    changeCurrentTitle: (title: string) => boolean;
    setPageChangeDelay: (delay: number) => void;

    // game state
    isGameOver: boolean;
    setIsGameOver: (value: boolean) => void;

    // scoreboard
    scoreboard: ResultProps[];

    // actions
    createGame: (payload: {timeLimit: number; numberOfArticles: number; maxPlayers: number; type: string; leaderName: string}) => void;
    joinGame: (payload: {sessionId: number; playerName: string}) => void;
    sendMessage: (content: string, sender: string) => void;
    checkRoomExists: (code: number) => Promise<boolean>;
    checkUsernameTaken: (name: string, code: number) => Promise<boolean>;
    checkGameHasStarted: (code: number) => Promise<boolean>;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
    const ws = useWebSocket()!;
    const {showPopup} = usePopup();

    // connexion/session
    const [leaderName, setLeader] = useState<string | null>(null);
    const [username, setUsername] = useState<string | null>(null);
    const [roomCode, setRoomCode] = useState<number>(-1);
    const [loadingGame, setLoading] = useState(false);

    // settings
    const [settings, setSettings] = useState<GameSettingsType>({timeLimit: 10, numberOfArticles: 4, maxPlayers: 10, type: "private"});

    // game state
    const [isGameOver, setIsGameOver] = useState(false);

    // articles
    const [articles, setArticles] = useState<Article[]>([]);
    const [startArticle, setStart] = useState("");

    // article navigation
    const [currentTitle, setCurrentTitle] = useState<string>(startArticle);
    const [remainingDelay, setPageChangeDelay] = useState<number>(0);

    // scoreboard
    const [scoreboard, setScoreboard] = useState<ResultProps[]>([]);

    useEffect(() => {
        const handler = (data: any) => {
            switch (data.kind) {
                case "game_session_created":
                    setRoomCode(data.sessionId);
                    setLeader(data.leaderName);
                    setUsername(data.username);
                    if (data.settings as GameSettingsType) setSettings(data.settings);
                    break;
                case "settings_modified":
                    if (data.settings as GameSettingsType) setSettings(data.settings);
                    break;
                case "game_launched":
                    setLoading(true);
                    break;
                case "game_started":
                    setLoading(false);
                    setStart(data.startArticle);
                    setCurrentTitle(data.startArticle);
                    setArticles(data.articles.map((n: string) => ({name: n, found: false})));
                    break;
                case "game_update": {
                    const objectivesVisited: string[] = data.event.obj_visited;
                    const objectivesToVisit: string[] = data.event.obj_to_visit;
                    setArticles(() => objectivesToVisit.map(name => ({name, found: false})).concat(objectivesVisited.map(name => ({name, found: true}))));
                    break;
                }
                case "game_over":
                    setIsGameOver(true);
                    setLoading(false);
                    setScoreboard(data.scoreboard);
                    setArticles([]);
                    setStart("");
                    break;
                case "room_closed":
                    ws.ws?.close();
                    break;
            }
        };
        ws.onMessage(handler);
        return () => ws.offMessage(handler);
    }, [ws]);

    useEffect(() => {
        if (remainingDelay <= 0) return;
        const timerId = setInterval(() => {
            setPageChangeDelay(prev => Math.max(0, prev - 1));
        }, 1000);
        return () => clearInterval(timerId);
    }, [remainingDelay]);

    const changeCurrentTitle = (title: string) => {
        if (remainingDelay <= 0) {
            setCurrentTitle(title);
            return true;
        } else {
            showPopup(
                "error",
                `${artifactDefinitions.Escargot.definition} (${remainingDelay}s restant)`
            );
        }
        return false;
    }

    const createGame = (payload: any) => ws.send({kind: "create_game_session", ...payload});
    const joinGame = (payload: any) => ws.send({kind: "join_game_session", ...payload});
    const sendMessage = (content: string, sender: string) => ws.send({kind: "send_message", content, sender});
    const updateSettings = (payload: GameSettingsType) => ws.send({kind: "update_settings", ...payload});

    const checkRoomExists = async (code: number) => {
        await ws.waitForConnection();
        return new Promise<boolean>(resolve => {
            const handler = (data: {kind: string; exists: boolean}) => {
                if (data.kind === "room_check_result") {
                    resolve(data.exists);
                }
            };
            ws.onMessage(handler);
            ws.send({kind: "check_room", roomCode: code});
            setTimeout(() => resolve(false), 2000);
        });
    };

    const checkUsernameTaken = async (name: string, code: number) => {
        return new Promise<boolean>(resolve => {
            const handler = (data: {kind: string; taken: boolean}) => {
                if (data.kind === "username_check_result") resolve(data.taken);
            };
            ws.onMessage(handler);
            ws.send({kind: "check_username", username: name, roomCode: code});
            setTimeout(() => resolve(false), 2000);
        });
    };

    const checkGameHasStarted = async (code: number) => {
        await ws.waitForConnection();
        return new Promise<boolean>(resolve => {
            const handler = (data: {kind: string; started: boolean}) => {
                if (data.kind === "game_started_check_result") resolve(data.started);
            };
            ws.onMessage(handler);
            ws.send({kind: "check_game_started", roomCode: code});
            setTimeout(() => resolve(false), 2000);
        });
    };

    return (
        <GameContext.Provider
            value={{
                leaderName,
                username,
                roomCode,
                loadingGame,
                settings,
                updateSettings,
                isGameOver,
                setIsGameOver,
                startArticle,
                articles,
                currentTitle,
                changeCurrentTitle,
                setPageChangeDelay,
                scoreboard,
                createGame,
                joinGame,
                sendMessage,
                checkRoomExists,
                checkUsernameTaken,
                checkGameHasStarted,
            }}>
            {children}
        </GameContext.Provider>
    );
};

export const useGameContext = (): GameContextType => {
    const ctx = useContext(GameContext);
    if (!ctx) throw new Error("useGameContext doit être utilisé dans GameProvider");
    return ctx;
};

"use client";

import React, {createContext, useEffect, useRef, useState} from "react";
import {TimelineStep} from "../components/Sections/Game/CollapsiblePanel/PlayerProgressPanel.tsx";

export interface SocketContextType {
    isConnected: boolean;
    messages: any[];
    sendMessageToServer: (msg: any) => void;
    createGameSession: (payload: {timeLimit: number; numberOfArticles: number; maxPlayers: number; type: string; leaderName: string}) => void;
    joinGameSession: (payload: {sessionId: number; playerName: string}) => void;
    leaderName: string | null;
    sendMessage: (content: string, sender: string) => void;
    username: string | null;
    setUsername: (name: string) => void;
    roomCode: number;
    setRoomCode: (code: number) => void;
    checkRoomExists: (roomCode: number) => Promise<boolean>;
    checkGameHasStarted: (roomCode: number) => Promise<boolean>;
    checkUsernameTaken: (username: string, roomCode: number) => Promise<boolean>;
    updateSettings: (payload: {timeLimit: number; numberOfArticles: number; maxPlayers: number; type: string}) => void;
    getHistory: () => void;
    // Game session settings
    gameTimeLimit: number;
    gameNumberOfArticles: number;
    gameMaxPlayers: number;
    gameType: string;
    articles: {name: string, found: boolean}[];
    startArticle: string;
    players: {username: string; role: string}[];
    playerHistories: {[playerName: string]: TimelineStep[]};
    loadingGame: boolean;
}

export const SocketContext = createContext<SocketContextType | undefined>(undefined);

interface SocketProviderProps {
    children: React.ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({children}) => {
    const [isConnected, setIsConnected] = useState(false);
    const [messages, setMessages] = useState<any[]>([]);
    const [leaderName, setLeaderName] = useState<string | null>(null);
    const [username, setUsername] = useState<string | null>(null);
    const [roomCode, setRoomCode] = useState<number>(-1);
    const socketRef = useRef<WebSocket | null>(null);
    const [loadingGame, setLoadingGame] = useState(false);

    const [gameTimeLimit, setGameTimeLimit] = useState<number>(10);
    const [gameNumberOfArticles, setNumberOfArticles] = useState<number>(4);
    const [gameMaxPlayers, setMaxPlayers] = useState<number>(10);
    const [gameType, setType] = useState<string>("private");
    const [startArticle, setStartArticle] = useState<string>("");
    const [articles, setArticles] = useState<{name: string, found: boolean}[]>([]);

    const [players, setPlayers] = useState<{username: string; role: string}[]>([]);
    const [playerHistories, setPlayerHistories] = useState<{[playerName: string]: TimelineStep[]}>({});

    useEffect(() => {
        const socket = new WebSocket(import.meta.env.VITE_MODE === "prod" ? import.meta.env.VITE_WS_DOMAIN_PROD : import.meta.env.VITE_WS_DOMAIN_LOCAL);
        socketRef.current = socket;

        socket.onopen = () => {
            setIsConnected(true);
            console.log("Connecté au serveur WebSocket");
        };

        socket.onmessage = event => {
            try {
                const data = JSON.parse(event.data);
                console.log("Message reçu :", data);
                if (data.kind === "game_session_created") {
                    setRoomCode(data.sessionId);
                    setLeaderName(data.leaderName);
                } else if (data.kind === "settings_modified") {
                    setGameTimeLimit(data.timeLimit);
                    setNumberOfArticles(data.numberOfArticles);
                    setMaxPlayers(data.maxPlayers);
                    setType(data.type);
                } else if (data.kind === "players_update") {
                    setPlayers(data.players);
                    setPlayerHistories(prev => {
                        const updated = {...prev};
                        data.players.forEach((p: {username: string}) => {
                            if (!updated[p.username]) {
                                updated[p.username] = [];
                            }
                        });
                        return updated;
                    });
                } else if (data.kind === "room_closed") {
                    socket.close();
                } else if (data.kind === "game_launched") {
                    setLoadingGame(true);
                } else if (data.kind === "game_started") {
                    setStartArticle(data.startArticle);
                    const updatedArticles = data.articles.map((name: string) => ({
                        name: name,
                        found: false,
                    }));
                    setArticles(updatedArticles);
                    setLoadingGame(false);
                } else if (data.kind === "history" && data.history) {
                    const histories: {[playerName: string]: any[]} = {};
                    data.history.forEach((item: {player: string; history: any[]}) => {
                        histories[item.player] = item.history;
                    });
                    setPlayerHistories(histories);
                } else if (data.kind === "game_update" && data.event) {
                    const {type, data: eventData} = data.event;
                    const playerName = eventData?.player || eventData?.playerName;
                    if (playerName) {
                        const cleanedData = {...eventData};

                        const timelineStep = {
                            id: Date.now(),
                            type,
                            data: cleanedData,
                        };
                        setPlayerHistories(prev => ({
                            ...prev,
                            [playerName]: [...(prev[playerName] || []), timelineStep],
                        }));

                        if (type == "foundPage" && playerName === username) {
                            const updatedArticles = articles.map(article => {
                                if (article.name === eventData.page_name) {
                                    return {...article, found: true};
                                }
                                return article;
                            });
                            setArticles(updatedArticles);
                            console.log("Articles mis à jour :", updatedArticles);
                        }
                    }
                } else {
                    setMessages(prev => [...prev, data]);
                }
            } catch (error) {
                console.error("Erreur lors du parsing du message", error);
            }
        };

        socket.onclose = () => {
            setIsConnected(false);
            window.location.href = "/";
            console.log("Déconnecté du serveur WebSocket");
        };

        socket.onerror = error => {
            console.error("Erreur WebSocket :", error);
        };
    }, []);

    const sendMessageToServer = (msg: any) => {
        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
            socketRef.current.send(JSON.stringify(msg));
        }
    };

    const createGameSession = (payload: {timeLimit: number; numberOfArticles: number; maxPlayers: number; type: string; leaderName: string}) => {
        sendMessageToServer({
            kind: "create_game_session",
            ...payload,
        });
    };

    const joinGameSession = (payload: {sessionId: number; playerName: string}) => {
        sendMessageToServer({
            kind: "join_game_session",
            ...payload,
        });
    };

    const sendMessage = (content: string, sender: string) => {
        sendMessageToServer({
            kind: "send_message",
            content,
            sender,
        });
    };

    const updateSettings = (payload: {timeLimit: number; numberOfArticles: number; maxPlayers: number; type: string}) => {
        sendMessageToServer({
            kind: "update_settings",
            ...payload,
        });
    };

    const getHistory = () => {
        sendMessageToServer({
            kind: "get_history",
        });
    };

    const waitForConnection = (): Promise<void> => {
        return new Promise(resolve => {
            const interval = setInterval(() => {
                if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
                    clearInterval(interval);
                    resolve();
                }
            }, 50);
        });
    };

    const checkRoomExists = async (roomCodeToCheck: number): Promise<boolean> => {
        if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) {
            await waitForConnection();
        }

        return new Promise(resolve => {
            const handler = (event: MessageEvent) => {
                try {
                    const data = JSON.parse(event.data);
                    if (data.kind === "room_check_result") {
                        socketRef.current?.removeEventListener("message", handler);
                        resolve(data.exists);
                    }
                } catch (error) {
                    console.error("checkRoomExists error: ", error);
                }
            };

            socketRef.current?.addEventListener("message", handler);

            sendMessageToServer({
                kind: "check_room",
                roomCode: roomCodeToCheck,
            });

            setTimeout(() => {
                socketRef.current?.removeEventListener("message", handler);
                resolve(false);
            }, 2000);
        });
    };

    const checkUsernameTaken = async (usernameToCheck: string, roomCodeToCheck: number): Promise<boolean> => {
        return new Promise(resolve => {
            if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) {
                resolve(false);
                return;
            }
            const handler = (event: MessageEvent) => {
                try {
                    const data = JSON.parse(event.data);
                    if (data.kind === "username_check_result") {
                        socketRef.current?.removeEventListener("message", handler);
                        resolve(data.taken);
                    }
                } catch (error) {
                    console.error("checkUsernameTaken error: ", error);
                }
            };

            socketRef.current.addEventListener("message", handler);

            sendMessageToServer({
                kind: "check_username",
                username: usernameToCheck,
                roomCode: roomCodeToCheck,
            });

            // Timeout
            setTimeout(() => {
                socketRef.current?.removeEventListener("message", handler);
                resolve(false);
            }, 2000);
        });
    };

    const checkGameHasStarted = async (roomCodeToCheck: number): Promise<boolean> => {
        if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) {
            await waitForConnection();
        }

        return new Promise(resolve => {
            const handler = (event: MessageEvent) => {
                try {
                    const data = JSON.parse(event.data);
                    if (data.kind === "game_started_check_result") {
                        socketRef.current?.removeEventListener("message", handler);
                        resolve(data.started);
                    }
                } catch (error) {
                    console.error("checkGameHasStarted error: ", error);
                }
            };

            socketRef.current?.addEventListener("message", handler);

            sendMessageToServer({
                kind: "check_game_started",
                roomCode: roomCodeToCheck,
            });

            setTimeout(() => {
                socketRef.current?.removeEventListener("message", handler);
                resolve(false);
            }, 2000);
        });
    };

    return (
        <SocketContext.Provider
            value={{
                isConnected,
                messages,
                sendMessageToServer,
                createGameSession,
                joinGameSession,
                sendMessage,
                username,
                setUsername,
                roomCode,
                setRoomCode,
                leaderName,
                checkUsernameTaken,
                checkRoomExists,
                checkGameHasStarted,
                updateSettings,
                gameTimeLimit,
                gameNumberOfArticles,
                gameMaxPlayers,
                gameType,
                articles,
                startArticle,
                players,
                playerHistories,
                getHistory,
                loadingGame,
            }}>
            {children}
        </SocketContext.Provider>
    );
};

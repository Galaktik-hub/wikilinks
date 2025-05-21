import React, {createContext, useContext, useEffect, useState} from "react";
import {useWebSocket} from "./WebSocketContext.tsx";
import {GameSettingsType} from "../components/Sections/WaitingRoom/GameSettings/GameSettings.tsx";
import {ResultProps} from "../pages/Result/Result.tsx";
import {useNavigate} from "react-router-dom";

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
    const navigate = useNavigate();

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
                    setArticles(data.articles.map((n: string) => ({name: n, found: false})));
                    break;
                case "game_update":
                    if (data.event.type === "foundPage") {
                        const p = data.event.data.page_name;
                        setArticles(prev => prev.map(a => (a.name === p ? {...a, found: true} : a)));
                    }
                    break;
                case "game_over":
                    setIsGameOver(true);
                    setLoading(false);
                    setScoreboard(data.scoreboard);
                    setArticles([]);
                    setStart("");
                    break;
                case "room_closed":
                    navigate("/");
                    break;
            }
        };
        ws.onMessage(handler);
        return () => ws.offMessage(handler);
    }, [ws]);

    const createGame = (payload: any) => ws.send({kind: "create_game_session", ...payload});
    const joinGame = (payload: any) => ws.send({kind: "join_game_session", ...payload});
    const sendMessage = (content: string, sender: string) => ws.send({kind: "send_message", content, sender});
    const updateSettings = (payload: GameSettingsType) => ws.send({kind: "update_settings", ...payload});

    const checkRoomExists = async (code: number) => {
        await ws.waitForConnection();
        return new Promise<boolean>(resolve => {
            const handler = (data: any) => {
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
            const handler = (data: any) => {
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
            const handler = (data: any) => {
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

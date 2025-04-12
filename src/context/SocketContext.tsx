import React, {createContext, useEffect, useRef, useState} from "react";

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
    // Pour vérifier l'existence d'une room (ici, simulation)
    checkRoomExists: (roomCode: number) => Promise<boolean>;
    updateSettings: (payload: {timeLimit: number; numberOfArticles: number; maxPlayers: number; type: string}) => void;
    // Game session settings
    gameTimeLimit: number;
    gameNumberOfArticles: number;
    gameMaxPlayers: number;
    gameType: string;

    players: {username: string; role: string}[];
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

    const [gameTimeLimit, setGameTimeLimit] = useState<number>(10);
    const [gameNumberOfArticles, setNumberOfArticles] = useState<number>(4);
    const [gameMaxPlayers, setMaxPlayers] = useState<number>(10);
    const [gameType, setType] = useState<string>("private");

    const [players, setPlayers] = useState<{username: string; role: string}[]>([]);

    useEffect(() => {
        const socket = new WebSocket("ws://localhost:2025");
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
                } else if (data.kind === "room_closed") {
                    // Return to the home page
                    window.location.href = "/";
                    socket.close();
                } else {
                    setMessages(prev => [...prev, data]);
                }
            } catch (error) {
                console.error("Erreur lors du parsing du message", error);
            }
        };

        socket.onclose = () => {
            setIsConnected(false);
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

    const checkRoomExists = async (roomCode: number): Promise<boolean> => {
        return new Promise(resolve => {
            setTimeout(() => resolve(roomCode >= 100000 && roomCode <= 999999), 1000);
        });
    };

    const updateSettings = (payload: {timeLimit: number; numberOfArticles: number; maxPlayers: number; type: string}) => {
        sendMessageToServer({
            kind: "update_settings",
            ...payload,
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
                checkRoomExists,
                updateSettings,
                gameTimeLimit,
                gameNumberOfArticles,
                gameMaxPlayers,
                gameType,
                players,
            }}>
            {children}
        </SocketContext.Provider>
    );
};

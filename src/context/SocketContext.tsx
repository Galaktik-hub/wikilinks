// SocketProvider.tsx
import React, { createContext, useEffect, useRef, useState } from "react";

export interface SocketContextType {
    isConnected: boolean;
    messages: any[];
    sendMessageToServer: (msg: any) => void;
    createGameSession: (payload: {
        timeLimit: number;
        numberOfArticles: number;
        maxPlayers: number;
        type: string;
        leaderName: string;
    }) => void;
    joinGameSession: (payload: { sessionId: string; playerName: string }) => void;
    sendMessage: (content: string, sender: string ) => void;
    username: string | null;
    setUsername: (name: string) => void;
    roomCode: string | null;
    setRoomCode: (code: string | null) => void;
    // Pour vérifier l'existence d'une room (ici, simulation)
    checkRoomExists: (roomCode: string) => Promise<boolean>;
}

export const SocketContext = createContext<SocketContextType | undefined>(undefined);

interface SocketProviderProps {
    children: React.ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
    const [isConnected, setIsConnected] = useState(false);
    const [messages, setMessages] = useState<any[]>([]);
    const [username, setUsername] = useState<string | null>(null);
    const [roomCode, setRoomCode] = useState<string | null>(null);
    const socketRef = useRef<WebSocket | null>(null);

    useEffect(() => {
        const socket = new WebSocket("ws://localhost:2025");
        socketRef.current = socket;

        socket.onopen = () => {
            setIsConnected(true);
            console.log("Connecté au serveur WebSocket");
        };

        socket.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                console.log("Message reçu :", data);
                setMessages((prev) => [...prev, data]);
            } catch (error) {
                console.error("Erreur lors du parsing du message", error);
            }
        };

        socket.onclose = () => {
            setIsConnected(false);
            console.log("Déconnecté du serveur WebSocket");
        };

        socket.onerror = (error) => {
            console.error("Erreur WebSocket :", error);
        };

        return () => {
            socket.close();
        };
    }, []);

    const sendMessageToServer = (msg: any) => {
        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
            socketRef.current.send(JSON.stringify(msg));
        }
    };

    const createGameSession = (payload: {
        timeLimit: number;
        numberOfArticles: number;
        maxPlayers: number;
        type: string;
        leaderName: string;
    }) => {
        sendMessageToServer({
            kind: "create_game_session",
            ...payload,
        });
    };

    const joinGameSession = (payload: { sessionId: string; playerName: string }) => {
        sendMessageToServer({
            kind: "join_game_session",
            ...payload,
        });
    };

    const sendMessage = (content: string, sender: string ) => {
        sendMessageToServer({
            kind: "send_message",
            content,
            sender,
        });
    }

    const checkRoomExists = async (roomCode: string): Promise<boolean> => {
        return new Promise((resolve) => {
            setTimeout(() => resolve(roomCode !== "000000"), 1000);
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
                checkRoomExists,
            }}
        >
            {children}
        </SocketContext.Provider>
    );
};

"use client";

import React, {createContext, useContext, useEffect, useRef, useState} from "react";
import {PlayersProvider} from "./PlayersContext.tsx";
import {GameProvider} from "./GameContext.tsx";
import {ChallengeProvider} from "./ChallengeContext";
import {useNavigate} from "react-router-dom";

interface WebSocketContextType {
    ws?: WebSocket | null;
    isConnected: boolean;
    messages: any[];
    send: (msg: any) => void;
    onMessage: (handler: (data: any) => void) => void;
    offMessage: (handler: (data: any) => void) => void;
    waitForConnection: () => Promise<void>;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

export const WebSocketProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
    const [isConnected, setConnected] = useState(false);
    const [messages, setMessages] = useState<any[]>([]);
    const wsRef = useRef<WebSocket | null>(null);
    const handlers = useRef<((data: any) => void)[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const socket = new WebSocket(import.meta.env.VITE_MODE === "prod" ? import.meta.env.VITE_WS_DOMAIN_PROD : import.meta.env.VITE_WS_DOMAIN_LOCAL);
        wsRef.current = socket;

        socket.onopen = () => {
            setConnected(true);
            console.log("Connecté au serveur WebSocket");
        };

        socket.onmessage = ({data}) => {
            try {
                const msg = JSON.parse(data);
                // We just look for the special event "disconnected" to redirect the user
                if (msg.kind === "disconnected") {
                    navigate("/");
                }
                setMessages(prev => [...prev, msg]);
                handlers.current.forEach(h => h(msg));
            } catch (error) {
                console.error("Erreur lors du parsing du message", error);
            }
        };
        socket.onclose = () => {
            setConnected(false);
            navigate("/");
            console.log("Déconnecté du serveur WebSocket");
        };
        socket.onerror = error => {
            console.error("Erreur WebSocket :", error);
            setConnected(false);
        };
    }, []);

    const send = (msg: any) => {
        if (wsRef.current?.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify(msg));
        }
    };

    const onMessage = (handler: (data: any) => void) => {
        handlers.current.push(handler);
    };

    const offMessage = (handler: (data: any) => void) => {
        handlers.current = handlers.current.filter(h => h !== handler);
    };

    const waitForConnection = (): Promise<void> => {
        return new Promise(resolve => {
            if (wsRef.current?.readyState === WebSocket.OPEN) return resolve();
            const interval = setInterval(() => {
                if (wsRef.current?.readyState === WebSocket.OPEN) {
                    clearInterval(interval);
                    resolve();
                }
            }, 50);
        });
    };

    return (
        <WebSocketContext.Provider value={{ws: wsRef.current, isConnected, messages, send, onMessage, offMessage, waitForConnection}}>
            <GameProvider>
                <ChallengeProvider>
                    <PlayersProvider>{children}</PlayersProvider>
                </ChallengeProvider>
            </GameProvider>
        </WebSocketContext.Provider>
    );
};

export const useWebSocket = (): WebSocketContextType => {
    const ctx = useContext(WebSocketContext);
    if (!ctx) throw new Error("useWebSocket doit être utilisé dans WebSocketProvider");
    return ctx;
};

import React, { createContext, useContext, useEffect, useRef, useState } from 'react';

const WS_URL = "ws://localhost:2025";

export type WebSocketMessage = {
    kind: string;
    [key: string]: any;
};

export type WebSocketContextType = {
    isConnected: boolean;
    sendMessage: (message: WebSocketMessage) => void;
    lastMessage: WebSocketMessage | null;
    connect: () => void;
    disconnect: () => void;
};

export const WebSocketContext = createContext<WebSocketContextType | null>(null);

export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isConnected, setIsConnected] = useState(false);
    const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null);
    const ws = useRef<WebSocket | null>(null);
    const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const shouldConnect = useRef(false);

    const connect = () => {
        if (ws.current?.readyState === WebSocket.OPEN) return;

        shouldConnect.current = true;
        ws.current = new WebSocket(WS_URL);

        ws.current.onopen = () => {
            console.log("Connected to WebSocket server");
            setIsConnected(true);
        };

        ws.current.onclose = () => {
            console.log("Disconnected from WebSocket server");
            setIsConnected(false);

            // Only attempt to reconnect if shouldConnect is true
            if (shouldConnect.current) {
                if (reconnectTimeoutRef.current) {
                    clearTimeout(reconnectTimeoutRef.current);
                }
                reconnectTimeoutRef.current = setTimeout(connect, 1000);
            }
        };

        ws.current.onerror = (error) => {
            console.error("WebSocket error:", error);
        };

        ws.current.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                console.log("Message received:", data);
                setLastMessage(data);
            } catch (error) {
                console.error("Error parsing WebSocket message:", error);
            }
        };
    };

    const disconnect = () => {
        shouldConnect.current = false;

        if (reconnectTimeoutRef.current) {
            clearTimeout(reconnectTimeoutRef.current);
            reconnectTimeoutRef.current = null;
        }

        if (ws.current) {
            ws.current.close();
            ws.current = null;
        }

        setIsConnected(false);
    };

    const sendMessage = (message: WebSocketMessage) => {
        if (ws.current && ws.current.readyState === WebSocket.OPEN) {
            ws.current.send(JSON.stringify(message));
        } else {
            console.error("Cannot send message, WebSocket is not connected");
        }
    };

    // Clean up on unmount
    useEffect(() => {
        return () => {
            disconnect();
        };
    }, []);

    return (
        <WebSocketContext.Provider value={{
            isConnected,
            sendMessage,
            lastMessage,
            connect,
            disconnect
        }}>
            {children}
        </WebSocketContext.Provider>
    );
};

export const useWebSocket = () => {
    const context = useContext(WebSocketContext);
    if (!context) {
        throw new Error('useWebSocket must be used within a WebSocketProvider');
    }
    return context;
};

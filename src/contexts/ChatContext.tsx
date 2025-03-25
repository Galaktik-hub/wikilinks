import React, { createContext, useContext, useEffect, useRef, useState } from 'react';

const WS_URL = "ws://localhost:2025";

export type ChatMessage = {
    sender: string;
    content: string;
};

export type ChatContextType = {
    username: string | null;
    roomCode: string | null;
    messages: ChatMessage[];
    isConnected: boolean;
    setUsername: (username: string | null) => void;
    setRoomCode: (roomCode: string | null) => void;
    sendMessage: (content: string) => void;
    disconnect: () => void;
};

export const ChatContext = createContext<ChatContextType | null>(null);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [username, setUsername] = useState<string | null>(null);
    const [roomCode, setRoomCode] = useState<string | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [isConnected, setIsConnected] = useState(false);
    const ws = useRef<WebSocket | null>(null);
    const shouldConnect = useRef(false);

    const connectToWebSocket = () => {
        if (!username || ws.current?.readyState === WebSocket.OPEN) return;

        ws.current = new WebSocket(WS_URL);
        shouldConnect.current = true;

        ws.current.onopen = () => {
            console.log("Connecté au serveur WebSocket");
            setIsConnected(true);
            if (ws.current && shouldConnect.current) {
                ws.current.send(JSON.stringify({
                    kind: roomCode ? 'join_room' : 'create_room',
                    room_id: roomCode || '',
                    user_name: username
                }));
            }
        };

        ws.current.onclose = () => {
            console.log("Déconnecté du serveur WebSocket");
            setIsConnected(false);
            if (shouldConnect.current) {
                setTimeout(connectToWebSocket, 1000);
            }
        };

        ws.current.onmessage = (event) => {
            const data = JSON.parse(event.data);
            console.log("Message reçu:", data);

            if (!shouldConnect.current) return;

            switch (data.kind) {
                case 'message_received':
                    setMessages(prev => [...prev, {
                        sender: data.sender,
                        content: data.content
                    }]);
                    break;
                case 'room_created':
                case 'room_joined':
                    setRoomCode(data.room_id);
                    break;
                case 'room_closed':
                    setMessages(prev => [...prev, {
                        sender: 'system',
                        content: data.message
                    }]);
                    cleanupChat();
                    break;
                case 'error':
                    if (data.message === "Room not found") {
                        setMessages(prev => [...prev, {
                            sender: 'system',
                            content: "Room not found"
                        }]);
                        cleanupChat();
                    } else {
                        setMessages(prev => [...prev, {
                            sender: 'system',
                            content: `Error: ${data.message}`
                        }]);
                    }
                    break;
            }
        };
    };

    const cleanupChat = () => {
        shouldConnect.current = false;
        if (ws.current) {
            ws.current.close();
        }
        setUsername(null);
        setRoomCode(null);
        setMessages([]);
        setIsConnected(false);
    };

    useEffect(() => {
        connectToWebSocket();
        return () => {
            shouldConnect.current = false;
            if (ws.current) {
                ws.current.close();
            }
        };
    }, [username, roomCode]);

    const sendMessage = (content: string) => {
        if (ws.current && isConnected && content.trim()) {
            ws.current.send(JSON.stringify({
                kind: 'send_message',
                content: content.trim()
            }));
        }
    };

    const disconnect = () => {
        if (ws.current) {
            ws.current.send(JSON.stringify({
                kind: 'disconnect'
            }));
            cleanupChat();
        }
    };

    return (
        <ChatContext.Provider
            value={{
                username,
                roomCode,
                messages,
                isConnected,
                setUsername,
                setRoomCode,
                sendMessage,
                disconnect
            }}
        >
            {children}
        </ChatContext.Provider>
    );
};

export const useChat = () => {
    const context = useContext(ChatContext);
    if (!context) {
        throw new Error('useChat must be used within a ChatProvider');
    }
    return context;
};

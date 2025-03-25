import React, { createContext, useContext, useEffect, useRef, useState } from 'react';

const WS_URL = "ws://localhost:2025";

// Clés pour le stockage temporaire (navigation)
const TEMP_USERNAME_KEY = 'temp_chat_username';
const TEMP_ROOMCODE_KEY = 'temp_chat_roomcode';

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
    // Initialiser avec les valeurs temporaires si elles existent
    const [username, _setUsername] = useState<string | null>(() => {
        const saved = sessionStorage.getItem(TEMP_USERNAME_KEY);
        return saved ? JSON.parse(saved) : null;
    });
    const [roomCode, _setRoomCode] = useState<string | null>(() => {
        const saved = sessionStorage.getItem(TEMP_ROOMCODE_KEY);
        return saved ? JSON.parse(saved) : null;
    });
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [isConnected, setIsConnected] = useState(false);
    const ws = useRef<WebSocket | null>(null);
    const shouldConnect = useRef(false);

    // Wrapper pour sauvegarder dans le sessionStorage
    const setUsername = (newUsername: string | null) => {
        if (newUsername) {
            sessionStorage.setItem(TEMP_USERNAME_KEY, JSON.stringify(newUsername));
        } else {
            sessionStorage.removeItem(TEMP_USERNAME_KEY);
        }
        _setUsername(newUsername);
    };

    const setRoomCode = (newRoomCode: string | null) => {
        if (newRoomCode) {
            sessionStorage.setItem(TEMP_ROOMCODE_KEY, JSON.stringify(newRoomCode));
        } else {
            sessionStorage.removeItem(TEMP_ROOMCODE_KEY);
        }
        _setRoomCode(newRoomCode);
    };

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
        sessionStorage.removeItem(TEMP_USERNAME_KEY);
        sessionStorage.removeItem(TEMP_ROOMCODE_KEY);
        _setUsername(null);
        _setRoomCode(null);
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

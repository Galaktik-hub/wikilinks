import React, { createContext, useContext, useEffect, useState } from 'react';
import { useWebSocket } from './WebSocketProvider';

// Keys for temporary storage (navigation)
const TEMP_USERNAME_KEY = 'temp_chat_username';
const TEMP_ROOMCODE_KEY = 'temp_chat_roomcode';
const TEMP_MESSAGES_KEY = 'temp_chat_messages';

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
    checkRoomExists: (roomCode: string) => Promise<boolean>;
};

export const ChatContext = createContext<ChatContextType | null>(null);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // Initialize with temporary values if they exist
    const [username, _setUsername] = useState<string | null>(() => {
        const saved = sessionStorage.getItem(TEMP_USERNAME_KEY);
        return saved ? JSON.parse(saved) : null;
    });
    const [roomCode, _setRoomCode] = useState<string | null>(() => {
        const saved = sessionStorage.getItem(TEMP_ROOMCODE_KEY);
        return saved ? JSON.parse(saved) : null;
    });
    const [messages, setMessages] = useState<ChatMessage[]>(() => {
        const saved = sessionStorage.getItem(TEMP_MESSAGES_KEY);
        return saved ? JSON.parse(saved) : [];
    });

    // Use the WebSocket context
    const { isConnected, sendMessage: wsSendMessage, lastMessage, connect, disconnect: wsDisconnect } = useWebSocket();

    // Wrapper to save in sessionStorage
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

    // Connect to WebSocket when username and roomCode are set
    useEffect(() => {
        if (username && (roomCode !== null || roomCode === "")) {
            connect();
            if (isConnected) {
                wsSendMessage({
                    kind: roomCode ? 'join_room' : 'create_room',
                    room_id: roomCode || '',
                    user_name: username
                });
            }
        }
    }, [username, roomCode, isConnected]);

    // Handle WebSocket messages
    useEffect(() => {
        if (!lastMessage) return;

        switch (lastMessage.kind) {
            case 'message_received':
                setMessages(prev => {
                    const newMessages = [...prev, {
                        sender: lastMessage.sender,
                        content: lastMessage.content
                    }];
                    sessionStorage.setItem(TEMP_MESSAGES_KEY, JSON.stringify(newMessages));
                    return newMessages;
                });
                break;
            case 'room_created':
            case 'room_joined':
                setRoomCode(lastMessage.room_id);
                break;
            case 'room_closed':
                setMessages(prev => {
                    const newMessages = [...prev, {
                        sender: 'system',
                        content: lastMessage.message
                    }];
                    sessionStorage.setItem(TEMP_MESSAGES_KEY, JSON.stringify(newMessages));
                    return newMessages;
                });
                cleanupChat();
                break;
            case 'error':
                if (lastMessage.message === "Room not found") {
                    setMessages(prev => {
                        const newMessages = [...prev, {
                            sender: 'system',
                            content: "Room not found"
                        }];
                        sessionStorage.setItem(TEMP_MESSAGES_KEY, JSON.stringify(newMessages));
                        return newMessages;
                    });
                    cleanupChat();
                } else {
                    setMessages(prev => {
                        const newMessages = [...prev, {
                            sender: 'system',
                            content: `Error: ${lastMessage.message}`
                        }];
                        sessionStorage.setItem(TEMP_MESSAGES_KEY, JSON.stringify(newMessages));
                        return newMessages;
                    });
                }
                break;
        }
    }, [lastMessage]);

    const cleanupChat = () => {
        wsDisconnect();
        sessionStorage.removeItem(TEMP_USERNAME_KEY);
        sessionStorage.removeItem(TEMP_ROOMCODE_KEY);
        sessionStorage.removeItem(TEMP_MESSAGES_KEY);
        _setUsername(null);
        _setRoomCode(null);
        setMessages([]);
    };

    const sendMessage = (content: string) => {
        if (isConnected && content.trim()) {
            wsSendMessage({
                kind: 'send_message',
                content: content.trim()
            });
        }
    };

    const disconnect = () => {
        if (isConnected) {
            wsSendMessage({
                kind: 'disconnect'
            });
            cleanupChat();
        }
    };

    const checkRoomExists = (roomCodeToCheck: string): Promise<boolean> => {
        return new Promise((resolve, reject) => {
            // Create a new WebSocket instance for checking
            const tempWs = new WebSocket("ws://localhost:2025");

            // Set a timeout to avoid infinite waiting
            const timeoutId = setTimeout(() => {
                if (tempWs.readyState === WebSocket.OPEN) {
                    tempWs.close();
                }
                reject(new Error("Timeout: unable to connect to server"));
            }, 5000);

            tempWs.onopen = () => {
                // Try to join the room with a temporary name to check if it exists
                tempWs.send(JSON.stringify({
                    kind: 'join_room',
                    room_id: roomCodeToCheck,
                    user_name: '_check_' // Temporary name for verification
                }));
            };

            tempWs.onmessage = (event) => {
                clearTimeout(timeoutId);
                const data = JSON.parse(event.data);

                // If we receive room_joined, the room exists
                if (data.kind === 'room_joined') {
                    tempWs.close();
                    resolve(true);
                }
                // If we receive an error "Room not found", the room doesn't exist
                else if (data.kind === 'error' && data.message === "Room not found") {
                    tempWs.close();
                    resolve(false);
                }
                // Other errors
                else if (data.kind === 'error') {
                    tempWs.close();
                    reject(new Error(data.message || "Error checking room existence"));
                }
            };

            tempWs.onerror = () => {
                clearTimeout(timeoutId);
                tempWs.close();
                reject(new Error("Error connecting to server"));
            };
        });
    };

    return (
        <ChatContext.Provider value={{
            username,
            roomCode,
            messages,
            isConnected,
            setUsername,
            setRoomCode,
            sendMessage,
            disconnect,
            checkRoomExists
        }}>
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

"use client";

import * as React from "react";
import Container from "../../../Container.tsx";
import { ChatInput } from "../../../Chat/ChatInput.tsx";
import { SendButton } from "../../../Chat/SendButton.tsx";
import RoomModal from "../../../Modals/WaitingRoom/RoomModal";

const WS_URL = "ws://localhost:2025";

type ChatMessage = {
    sender: string;
    content: string;
};

export const TextLoungePanel: React.FC = () => {
    const [username, setUsername] = React.useState<string | null>(null);
    const [roomCode, setRoomCode] = React.useState<string | null>(null);
    const [message, setMessage] = React.useState("");
    const [messages, setMessages] = React.useState<ChatMessage[]>([]);
    const [isInputFocused, setIsInputFocused] = React.useState(false);
    const [showError, setShowError] = React.useState(false);
    const messagesEndRef = React.useRef<HTMLDivElement>(null);
    const ws = React.useRef<WebSocket | null>(null);

    // Connexion au serveur
    React.useEffect(() => {
        if (username) {
            ws.current = new WebSocket(WS_URL);

            ws.current.onopen = () => {
                console.log("Connecté au serveur WebSocket");
                if (ws.current) {
                    // Si un code est fourni, on rejoint la salle, sinon on en crée une
                    ws.current.send(JSON.stringify({
                        kind: roomCode ? 'join_room' : 'create_room',
                        room_id: roomCode || '',
                        user_name: username
                    }));
                }
            };

            ws.current.onmessage = (event) => {
                const data = JSON.parse(event.data);
                console.log("Message reçu:", data);

                switch (data.kind) {
                    case 'message_received':
                        setMessages(prev => [...prev, {
                            sender: data.sender,
                            content: data.content
                        }]);
                        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
                        break;
                    case 'room_created':
                    case 'room_joined':
                        setRoomCode(data.room_id);
                        break;
                    case 'error':
                        if (data.message === "Room not found") {
                            setShowError(true);
                            setTimeout(() => {
                                setShowError(false);
                                setUsername(null);
                            }, 2000);
                        } else {
                            setMessages(prev => [...prev, {
                                sender: 'Système',
                                content: `Erreur: ${data.message}`
                            }]);
                        }
                        break;
                }
            };

            return () => {
                if (ws.current) {
                    ws.current.close();
                }
            };
        }
    }, [username, roomCode]);

    const handleSendMessage = React.useCallback(() => {
        if (ws.current && message.trim() && username) {
            ws.current.send(JSON.stringify({
                kind: 'send_message',
                content: message.trim()
            }));
            setMessage("");
        }
    }, [message, username]);

    const handleKeyDown = React.useCallback(
        (e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
            }
        },
        [handleSendMessage]
    );

    const MessageBubble = React.useCallback(({ msg, index }: { msg: ChatMessage; index: number }) => (
        <div key={index}
            className={`mb-2 p-3 rounded-lg border border-gray-700/50 ${msg.sender === 'Système' ? 'bg-yellow-950/50' :
                    msg.sender === username ? 'bg-sky-950/50' : 'bg-[#12151A]'
                }`}>
            <strong className="text-sky-500" style={{ textShadow: "0 0 10px rgba(14, 165, 233, 0.3)" }}>
                {msg.sender}
            </strong>
            <span className="mx-2 text-gray-500">:</span>
            <span className="text-gray-100">{msg.content}</span>
        </div>
    ), [username]);

    return (
        <>
            <RoomModal
                onSubmit={(pseudo, code) => {
                    setUsername(pseudo);
                    setRoomCode(code);
                }}
                shouldOpen={!username}
                showError={showError}
            />
            {/* Desktop version */}
            <div className="hidden xl-custom:block w-full h-full">
                <Container className="flex flex-col h-full">
                    <h2 className="gap-2.5 py-1 text-lg font-bold leading-none text-sky-500 text-center mb-2"
                        style={{ textShadow: "0px 0px 14px #0ea5e9" }}>
                        {roomCode ? `Salon Textuel - ${roomCode}` : 'Salon Textuel'}
                    </h2>

                    <div className="flex flex-col flex-grow bg-[#181D25] rounded-lg overflow-hidden">
                        <div className="flex-grow overflow-y-auto p-4">
                            {messages.length > 0 ? (
                                messages.map((msg, index) => (
                                    <MessageBubble key={index} msg={msg} index={index} />
                                ))
                            ) : (
                                <p className="text-gray-400 text-center">Aucun message pour l'instant...</p>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        <div className="flex items-center w-full p-2 bg-[#12151A] rounded-b-lg gap-2">
                            <ChatInput
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                onKeyDown={handleKeyDown}
                                onFocus={() => setIsInputFocused(true)}
                                onBlur={() => setIsInputFocused(false)}
                            />
                            <div className={`transition-all duration-200 ease-in-out ${message.trim() ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
                                <SendButton onClick={handleSendMessage} disabled={!message.trim()} />
                            </div>
                        </div>
                    </div>
                </Container>
            </div>

            {/* Mobile version */}
            <div className="xl-custom:hidden w-full z-50">
                {/* Overlay that appears when the input is focused */}
                <div
                    className={`fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300 ${isInputFocused ? 'opacity-100 visible' : 'opacity-0 invisible'
                        }`}
                    onClick={() => setIsInputFocused(false)}
                />

                {/* Container for messages that appears when the input is focused */}
                <div className={`fixed bottom-16 left-0 right-0 bg-[#181D25] transition-transform duration-300 ease-out ${isInputFocused ? 'translate-y-0' : 'translate-y-full'
                    }`}>
                    <h2
                        className="gap-2.5 py-3 text-lg font-bold leading-none text-sky-500 text-center"
                        style={{ textShadow: "0px 0px 14px #0ea5e9" }}
                    >
                        Salon Textuel
                    </h2>
                    <div className="h-[50vh] overflow-y-auto p-4">
                        {messages.length > 0 ? (
                            messages.map((msg, index) => (
                                <MessageBubble key={index} msg={msg} index={index} />
                            ))
                        ) : (
                            <p className="text-gray-400 text-center">Aucun message pour l'instant...</p>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                </div>

                {/* Input fixed at the bottom */}
                <div className="fixed bottom-0 left-0 right-0 p-2 bg-[#12151A] border-t border-gray-700">
                    <div className="flex items-center gap-2">
                        <ChatInput
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyDown={handleKeyDown}
                            onFocus={() => setIsInputFocused(true)}
                            onBlur={() => setIsInputFocused(false)}
                        />
                        <div className={`transition-all duration-200 ease-in-out ${message.trim() ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
                            <SendButton onClick={handleSendMessage} disabled={!message.trim()} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default TextLoungePanel;

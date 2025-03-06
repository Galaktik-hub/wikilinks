"use client";

import * as React from "react";
import { io, Socket } from "socket.io-client";
import Container from "../../../Container.tsx";
import { ChatInput } from "../../../Chat/ChatInput.tsx";
import { SendButton } from "../../../Chat/SendButton.tsx";
import RoomModal from "../../../Modals/WaitingRoom/RoomModal";

const SOCKET_URL = "http://localhost:3001";

type ChatMessage = {
    pseudo: string;
    message: string;
};

export const TextLoungePanel: React.FC = () => {
    const [username, setUsername] = React.useState<string | null>(null);
    const [roomCode, setRoomCode] = React.useState<string | null>(null);
    const [message, setMessage] = React.useState("");
    const [messages, setMessages] = React.useState<ChatMessage[]>([]);
    const [isInputFocused, setIsInputFocused] = React.useState(false);
    const messagesEndRef = React.useRef<HTMLDivElement>(null);
    const socket = React.useRef<Socket | null>(null);

    // Connexion au serveur
    React.useEffect(() => {
        socket.current = io(SOCKET_URL);

        socket.current.on("connect", () => {
            console.log("Connecté au serveur WebSocket", socket.current?.id);
            if (username && roomCode && socket.current) {
                socket.current.emit("joinRoom", { pseudo: username, code: roomCode });
            }
        });

        socket.current.on("connect_error", (err: Error) => {
            console.log("Erreur de connexion WebSocket:", err);
        });

        socket.current.on("receiveMessage", (data: ChatMessage) => {
            console.log("Message reçu: ", data);
            setMessages((prev) => [...prev, data]);
            setTimeout(() => {
                messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
            }, 100);
        });

        return () => {
            socket.current?.disconnect();
        };
    }, [roomCode, username]);

    React.useEffect(() => {
        if (username && roomCode && socket.current && socket.current.connected) {
            socket.current.emit("joinRoom", { pseudo: username, code: roomCode });
        }
    }, [username, roomCode]);

    const handleSendMessage = React.useCallback(() => {
        if (socket.current && message.trim() && username && roomCode) {
            socket.current.emit("sendMessage", { pseudo: username, message: message.trim(), code: roomCode });
            setMessage("");
        }
    }, [message, username, roomCode]);

    const handleKeyDown = React.useCallback(
        (e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
            }
        },
        [handleSendMessage]
    );

    // Si le pseudo ou le code n'est pas défini, on affiche le modal
    if (!username || !roomCode) {
        return (
            <RoomModal
                onSubmit={(pseudo, code) => {
                    setUsername(pseudo);
                    setRoomCode(code);
                }}
            />
        );
    }

    return (
        <>
            {/* Desktop version */}
            <div className="hidden md:block h-full">
                <Container className="flex flex-col h-full">
                    <h2
                        className="gap-2.5 py-1 text-lg font-bold leading-none text-sky-500 text-center mb-2"
                        style={{ textShadow: "0px 0px 14px #0ea5e9" }}
                    >
                        Salon Textuel
                    </h2>

                    <div className="flex flex-col flex-grow bg-[#181D25] rounded-lg overflow-hidden">
                        <div className="flex-grow overflow-y-auto p-4">
                            {messages.length > 0 ? (
                                messages.map((msg, index) => (
                                    <div key={index} className="mb-2 p-3 bg-[#12151A] rounded-lg border border-gray-700/50">
                                        <strong className="text-sky-500" style={{ textShadow: "0 0 10px rgba(14, 165, 233, 0.3)" }}>
                                            {msg.pseudo}
                                        </strong>
                                        <span className="mx-2 text-gray-500">:</span>
                                        <span className="text-gray-100">{msg.message}</span>
                                    </div>
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
            <div className="md:hidden">
                {/* Overlay that appears when the input is focused */}
                <div 
                    className={`fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300 ${
                        isInputFocused ? 'opacity-100 visible' : 'opacity-0 invisible'
                    }`}
                    onClick={() => setIsInputFocused(false)}
                />

                {/* Container for messages that appears when the input is focused */}
                <div className={`fixed bottom-16 left-0 right-0 bg-[#181D25] transition-transform duration-300 ease-out ${
                    isInputFocused ? 'translate-y-0' : 'translate-y-full'
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
                                <div key={index} className="mb-2 p-3 bg-[#12151A] rounded-lg border border-gray-700/50">
                                    <strong className="text-sky-500" style={{ textShadow: "0 0 10px rgba(14, 165, 233, 0.3)" }}>
                                        {msg.pseudo}
                                    </strong>
                                    <span className="mx-2 text-gray-500">:</span>
                                    <span className="text-gray-100">{msg.message}</span>
                                </div>
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

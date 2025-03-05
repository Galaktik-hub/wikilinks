"use client";

import * as React from "react";
import { io, Socket } from "socket.io-client";
import Container from "../../../Container.tsx";
import { ChatInput } from "../../../Chat/ChatInput.tsx";
import { SendButton } from "../../../Chat/SendButton.tsx";
import UsernameModal from "../../../Modals/WaitingRoom/UsernameModal.tsx";

const SOCKET_URL = "http://192.168.1.38:3001";

type ChatMessage = {
    pseudo: string;
    message: string;
};

export const TextLoungePanel: React.FC = () => {
    const [username, setUsername] = React.useState<string | null>(null);
    const [message, setMessage] = React.useState("");
    const [messages, setMessages] = React.useState<ChatMessage[]>([]);
    const messagesEndRef = React.useRef<HTMLDivElement>(null);
    const socket = React.useRef<Socket | null>(null);

    React.useEffect(() => {
        socket.current = io(SOCKET_URL);

        socket.current.on("connect", () => {
            console.log("Connecté au serveur WebSocket", socket.current?.id);
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
    }, []);

    const handleSendMessage = React.useCallback(() => {
        if (socket.current && message.trim() && username) {
            // Envoi d'un objet contenant le pseudo et le contenu du message
            socket.current.emit("sendMessage", { pseudo: username, message: message.trim() });
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

    return (
        <>
            {/* Affichage de la modale tant que le pseudo n'est pas défini */}
            {!username && <UsernameModal onSubmit={(name) => setUsername(name)} />}
            <Container className="min-w-[360px] flex flex-col justify-center items-center whitespace-nowrap h-full">
                <h2
                    className="gap-2.5 py-1 text-lg font-bold leading-none text-sky-500"
                    style={{ textShadow: "0px 0px 14px #0ea5e9" }}
                >
                    Salon Textuel
                </h2>

                {/* Zone d'affichage des messages */}
                <div className="mt-4 w-full text-base leading-none text-white flex flex-col bg-[#181D25] rounded-lg h-[300px] overflow-y-auto p-4">
                    {messages.length > 0 ? (
                        messages.map((msg, index) => (
                            <div key={index} className="mb-2 p-2 bg-gray-800 rounded-lg">
                                <strong>{msg.pseudo}</strong>: {msg.message}
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-400 text-center">Aucun message pour l’instant...</p>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Zone d'entrée du message */}
                <div className="flex items-center w-full p-2 mt-2 bg-[#181D25] rounded-lg">
                    <ChatInput
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={handleKeyDown}
                        onFocus={() => {}}
                        onBlur={() => {}}
                    />
                    <SendButton onClick={handleSendMessage} disabled={!message.trim()} />
                </div>
            </Container>
        </>
    );
};

export default TextLoungePanel;

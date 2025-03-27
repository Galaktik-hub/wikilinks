import * as React from "react";
import Container from "../../../Container.tsx";
import { ChatInput } from "../../../Chat/ChatInput.tsx";
import { SendButton } from "../../../Chat/SendButton.tsx";
import RoomModal from "../../../Modals/WaitingRoom/RoomModal";
import { useContext } from "react";
import { ChatContext, ChatMessage } from "../../../../contexts/ChatContext";

export const TextLoungePanel: React.FC = () => {
    const chat = useContext(ChatContext);
    const [message, setMessage] = React.useState("");
    const [isInputFocused, setIsInputFocused] = React.useState(false);
    const messagesEndRef = React.useRef<HTMLDivElement>(null);

    const handleSendMessage = () => {
        if (message.trim() && chat?.sendMessage) {
            chat.sendMessage(message.trim());
            setMessage("");
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    // Scroll to bottom when new messages arrive
    React.useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [chat?.messages]);

    const MessageBubble = React.useCallback(({ msg, index }: { msg: ChatMessage; index: number }) => (
        <div key={index}
            className={`mb-2 p-3 rounded-lg border border-gray-700/50 ${msg.sender === 'system' ? 'bg-yellow-950/50' :
                    msg.sender === chat?.username ? 'bg-sky-950/50' : 'bg-[#12151A]'
                }`}>
            <strong className="text-sky-500" style={{ textShadow: "0 0 10px rgba(14, 165, 233, 0.3)" }}>
                {msg.sender}
            </strong>
            <span className="mx-2 text-gray-500">:</span>
            <span className="text-gray-100">{msg.content}</span>
        </div>
    ), [chat?.username]);

    return (
        <>
            <RoomModal
                onSubmit={(username: string, roomCode: string) => {
                    if (chat?.setUsername && chat?.setRoomCode) {
                        chat.setUsername(username);
                        chat.setRoomCode(roomCode);
                    }
                }}
                shouldOpen={!chat?.username}
            />

            {/* Desktop version */}
            <div className="hidden xl-custom:block w-full h-full">
                <Container className="flex flex-col h-full">
                    <h2 className="gap-2.5 py-1 text-lg font-bold leading-none text-sky-500 text-center mb-2"
                        style={{ textShadow: "0px 0px 14px #0ea5e9" }}>
                        Salon Textuel
                    </h2>

                    <div className="flex flex-col flex-grow bg-[#181D25] rounded-lg max-h-[600px] overflow-hidden">
                        <div className="flex-grow overflow-auto p-4">
                            {chat?.messages.length ? (
                                chat.messages.map((msg, index) => (
                                    <MessageBubble key={index} msg={msg} index={index} />
                                ))
                            ) : (
                                <p className="text-gray-400 text-center">Aucun message pour l'instant...</p>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        <div className="p-4 border-t border-gray-700/50">
                            <div className="flex items-center gap-2">
                                <ChatInput
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Écrivez un message..."
                                    disabled={!chat?.isConnected}
                                />
                                <SendButton onClick={handleSendMessage} disabled={!chat?.isConnected || !message.trim()} />
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

                {/* Chat panel that slides up from bottom */}
                <div className={`fixed bottom-16 left-0 right-0 bg-[#181D25] transition-transform duration-300 ease-out ${isInputFocused ? 'translate-y-0' : 'translate-y-full'
                    }`}>
                    <h2
                        className="gap-2.5 py-3 text-lg font-bold leading-none text-sky-500 text-center"
                        style={{ textShadow: "0px 0px 14px #0ea5e9" }}
                    >
                        Salon Textuel
                    </h2>

                    <div className="max-h-[50vh] overflow-auto p-4">
                        {chat?.messages.length ? (
                            chat.messages.map((msg, index) => (
                                <MessageBubble key={index} msg={msg} index={index} />
                            ))
                        ) : (
                            <p className="text-gray-400 text-center">Aucun message pour l'instant...</p>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                </div>

                {/* Chat input at bottom of screen - always visible */}
                <div className="fixed bottom-0 left-0 right-0 p-4 bg-[#181D25] border-t border-gray-700/50">
                    <div className="flex items-center gap-2">
                        <ChatInput
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyDown={handleKeyDown}
                            onFocus={() => setIsInputFocused(true)}
                            placeholder="Écrivez un message..."
                            disabled={!chat?.isConnected}
                        />
                        <SendButton onClick={handleSendMessage} disabled={!chat?.isConnected || !message.trim()} />
                    </div>
                </div>
            </div>
        </>
    );
};

export default TextLoungePanel;

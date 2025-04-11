import * as React from "react";
import {ChatInput} from "../../../Chat/ChatInput.tsx";
import {SendButton} from "../../../Chat/SendButton.tsx";
import {useContext} from "react";
import {SocketContext} from "../../../../context/SocketContext";

export const TextLoungePanel: React.FC = () => {
    const socket = useContext(SocketContext);
    const [message, setMessage] = React.useState("");
    const [isInputFocused, setIsInputFocused] = React.useState(false);
    const messagesRef = React.useRef<HTMLDivElement[]>([]);

    const handleSendMessage = () => {
        if (message.trim() && socket?.sendMessage && socket?.username) {
            socket.sendMessage(message.trim(), socket.username);
            setMessage("");
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    // Function to scroll to bottom
    const scrollToBottom = () => {
        messagesRef.current.forEach(element => {
            if (element) {
                element.scrollTo({
                    top: element.scrollHeight,
                    behavior: "smooth",
                });
            }
        });
    };

    // Scroll to bottom when new messages arrive
    React.useEffect(() => {
        scrollToBottom();
    }, [socket?.messages]);

    // Function to add references to the list
    const addToRefs = (el: HTMLDivElement | null) => {
        if (el && !messagesRef.current.includes(el)) {
            messagesRef.current.push(el);
        }
    };

    const MessageBubble = React.useCallback(
        ({msg, index}: {msg: any; index: number}) => {
            if (msg.kind !== "message_received") {
                return null;
            }

            return (
                <div
                    key={index}
                    className={`mb-2 p-3 rounded-lg border border-gray-700/50 ${
                        msg.sender === "system" ? "bg-yellow-950/50" : msg.sender === socket?.username ? "bg-sky-950/50" : "bg-background"
                    }`}>
                    {msg.sender !== "Bot-JoinLeaveBot" && (
                        <>
                            <strong className="text-bluePrimary">{msg.sender}</strong>
                            <span className="mx-2 text-gray-500">:</span>
                        </>
                    )}
                    <span className="text-gray-100">{msg.content}</span>
                </div>
            );
        },
        [socket?.username],
    );

    return (
        <>
            {/* Desktop version */}
            <div className="card-container hidden xl-custom:flex flex-col h-full">
                <div className="w-full flex justify-center">
                    <h2 className="blue-title-effect">Salon Textuel</h2>
                </div>

                <div className="flex flex-col bg-darkBg rounded-lg overflow-hidden h-full mt-2.5">
                    <div className="flex-1 overflow-auto p-4 scroll-smooth max-h-full" ref={addToRefs}>
                        {socket?.messages.length ? (
                            socket.messages.map((msg, index) => <MessageBubble key={index} msg={msg} index={index} />)
                        ) : (
                            <p className="text-gray-400 text-center">Aucun message pour l'instant...</p>
                        )}
                    </div>

                    <div className="p-2 border-t border-gray-700/50">
                        <div className="flex items-center gap-2">
                            <ChatInput
                                value={message}
                                onChange={e => setMessage(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Écrivez un message..."
                                disabled={!socket?.isConnected}
                            />
                            <SendButton onClick={handleSendMessage} disabled={!socket?.isConnected || !message.trim()} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Version mobile */}
            <div className="xl-custom:hidden w-full z-50">
                {/* Overlay lors du focus sur l'input */}
                <div
                    className={`fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300 ${
                        isInputFocused ? "opacity-100 visible" : "opacity-0 invisible"
                    }`}
                    onClick={() => setIsInputFocused(false)}
                />

                {/* Chat panel that slides up from bottom */}
                <div
                    className={`fixed bottom-16 left-0 right-0 bg-darkBg transition-transform duration-300 ease-out ${
                        isInputFocused ? "translate-y-0" : "translate-y-full"
                    }`}>
                    <div className="w-full flex justify-center my-4">
                        <h2 className="blue-title-effect">Salon Textuel</h2>
                    </div>

                    <div className="h-[300px] overflow-auto px-4 pb-4 scroll-smooth" ref={addToRefs}>
                        {socket?.messages.length ? (
                            socket.messages.map((msg, index) => <MessageBubble key={index} msg={msg} index={index} />)
                        ) : (
                            <p className="text-gray-400 text-center">Aucun message pour l'instant...</p>
                        )}
                    </div>
                </div>

                {/* Chat input at bottom of screen - always visible */}
                <div className="fixed bottom-0 left-0 right-0 p-2 bg-darkBg border-t border-gray-700/50">
                    <div className="flex items-center gap-2">
                        <ChatInput
                            value={message}
                            onChange={e => setMessage(e.target.value)}
                            onKeyDown={handleKeyDown}
                            onFocus={() => setIsInputFocused(true)}
                            placeholder="Écrivez un message..."
                            disabled={!socket?.isConnected}
                        />
                        <SendButton onClick={handleSendMessage} disabled={!socket?.isConnected || !message.trim()} />
                    </div>
                </div>
            </div>
        </>
    );
};

export default TextLoungePanel;

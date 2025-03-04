"use client";

import * as React from "react";
import { ChatInput } from "./ChatInput.tsx";
import { SendButton } from "./SendButton.tsx";

export default function ChatSectionFooter() {
    const [message, setMessage] = React.useState("");
    const [isFocused, setIsFocused] = React.useState(false);

    const handleSendMessage = () => {
        if (message.trim()) {
            setMessage("");
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <>
            {/* Overlay noir animé qui glisse du bas vers le haut */}
            <div
                className={`fixed inset-0 bg-black bg-opacity-80 transition-transform duration-500 ease-in-out z-50 ${
                    isFocused ? "translate-y-0 pointer-events-auto" : "translate-y-full pointer-events-none"
                }`}
                onClick={() => setIsFocused(false)}
            />
            <section className="md:hidden fixed bottom-0 left-0 w-full flex flex-col justify-center p-4 bg-black bg-opacity-80 z-[100]">
                <div className="flex gap-2 items-center w-full h-full">
                    <ChatInput
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                    />
                    <SendButton onClick={handleSendMessage} />
                </div>
            </section>
        </>
    );
}

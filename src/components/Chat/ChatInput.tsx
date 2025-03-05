"use client";

import * as React from "react";

interface ChatInputProps {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    onFocus: () => void;
    onBlur: () => void;
}

export function ChatInput({ value, onChange, onKeyDown, onFocus, onBlur }: ChatInputProps) {
    return (
        <input
            type="text"
            value={value}
            onChange={onChange}
            onKeyDown={onKeyDown}
            onFocus={onFocus}
            onBlur={onBlur}
            placeholder="Écrivez votre message..."
            className="flex-1 shrink gap-2.5 self-stretch px-4 py-3 text-base text-gray-400 rounded-lg basis-0 min-w-60 bg-transparent focus:outline-none focus:ring-1 focus:ring-blue-600"
            aria-label="Message input"
        />
    );
}

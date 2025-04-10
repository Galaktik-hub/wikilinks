"use client";

import * as React from "react";

interface ChatInputProps {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    onFocus?: () => void;
    placeholder?: string;
    disabled?: boolean;
}

export function ChatInput({value, onChange, onKeyDown, onFocus, placeholder = "Écrivez votre message...", disabled}: ChatInputProps) {
    return (
        <input
            type="text"
            value={value}
            onChange={onChange}
            onKeyDown={onKeyDown}
            onFocus={onFocus}
            disabled={disabled}
            placeholder={placeholder}
            className="flex-1 pl-2 shrink gap-2.5 self-stretch py-3 text-base text-gray-400 rounded-lg basis-0 bg-transparent focus:outline-none focus:ring-1 focus:ring-blue-600 box-border"
            aria-label="Message input"
        />
    );
}

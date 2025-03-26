"use client";

import React from "react";

interface HomeInputProps {
    placeholder: string;
    value: string;
    maxLength?: number;
    onChange: (value: string) => void;
}

export const Input: React.FC<HomeInputProps> = ({
    placeholder,
    value,
    maxLength,
    onChange,
}) => {
    return (
        <input
            type="text"
            className="gap-2.5 self-stretch px-2.5 w-full text-base text-white bg-gray-700 rounded-lg min-h-12 focus:outline-none focus:shadow-[0_0_0_3px_rgba(29,151,216,1)]"
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            aria-label={placeholder}
            maxLength={maxLength}
        />
    );
};

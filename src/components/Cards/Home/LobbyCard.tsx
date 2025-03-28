"use client";

import React from "react";
import { Input } from "../../Inputs/Home/Input.tsx";
import MainButton from "../../Buttons/MainButton.tsx";

interface LobbyCardProps {
    inputPlaceholder: string;
    buttonText: string;
    icon?: React.ReactNode;
    maxLength?: number;
    value: string | null;
    onSubmit: (value: string) => void;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void | null;
    error?: string | null;
}

export const LobbyCard: React.FC<LobbyCardProps> = ({
    inputPlaceholder,
    buttonText,
    icon,
    maxLength,
    onSubmit,
    error
}) => {
    const [inputValue, setInputValue] = React.useState("");

    const handleSubmit = () => {
        onSubmit(inputValue);
    };

    return (
        <div className="card-container flex flex-col gap-4 min-w-60 w-[360px]">
            <Input
                placeholder={inputPlaceholder}
                value={inputValue}
                onChange={setInputValue}
                maxLength={maxLength}
            />
            {error && (
                <div className="text-red-500 text-sm mt-1 mb-2">{error}</div>
            )}
            <MainButton
                color="14, 165, 233"
                className="bg-bluePrimary w-full"
                onClick={handleSubmit}
            >
                {icon}
                <span className="text-center font-bold text-white">{buttonText}</span>
            </MainButton>
        </div>
    );
};

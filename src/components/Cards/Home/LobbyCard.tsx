"use client";

import React from "react";
import { Input } from "../../Inputs/Home/Input.tsx";
import { CreateOrJoinButton } from "../../Buttons/Home/CreateOrJoinButton.tsx";
import Container from "../../Container.tsx";

interface LobbyCardProps {
    inputPlaceholder: string;
    buttonText: string;
    buttonIcon?: boolean;
    maxLength?: number;
    value: string | null;
    onSubmit: (value: string) => void;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void | null;
    error?: string | null;
}

export const LobbyCard: React.FC<LobbyCardProps> = ({
    inputPlaceholder,
    buttonText,
    buttonIcon = false,
    maxLength,
    onSubmit,
    error
}) => {
    const [inputValue, setInputValue] = React.useState("");

    const handleSubmit = () => {
        onSubmit(inputValue);
    };

    return (
        <Container className="min-w-60 w-[360px]">
            <Input
                placeholder={inputPlaceholder}
                value={inputValue}
                onChange={setInputValue}
                maxLength={maxLength}
            />
            {error && (
                <div className="text-red-500 text-sm mt-1 mb-2">{error}</div>
            )}
            <CreateOrJoinButton text={buttonText} icon={buttonIcon} onClick={handleSubmit} />
        </Container>
    );
};

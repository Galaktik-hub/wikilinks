"use client";

import React from "react";
import { HomeInput } from "../Inputs/HomeInput";
import { CreateOrJoinButton } from "../Buttons/CreateOrJoinButton.tsx";
import Container from "../Container.tsx";

interface LobbyCardProps {
    inputPlaceholder: string;
    buttonText: string;
    buttonIcon?: string;
    onSubmit: (value: string) => void;
}

export const LobbyCard: React.FC<LobbyCardProps> = ({
                                                        inputPlaceholder,
                                                        buttonText,
                                                        buttonIcon,
                                                        onSubmit,
                                                    }) => {
    const [inputValue, setInputValue] = React.useState("");

    const handleSubmit = () => {
        onSubmit(inputValue);
    };

    return (
        <Container className="min-w-60 w-[360px]">
            <HomeInput
                placeholder={inputPlaceholder}
                value={inputValue}
                onChange={setInputValue}
            />
            <CreateOrJoinButton text={buttonText} icon={buttonIcon} onClick={handleSubmit} />
        </Container>
    );
};

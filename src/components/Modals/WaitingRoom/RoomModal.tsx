"use client";

import * as React from "react";
import { useModalContext } from "../ModalProvider.tsx";
import { useEffect, useRef, useState } from "react";

interface RoomModalProps {
    onSubmit: (pseudo: string, code: string) => void;
    shouldOpen: boolean;
    showError?: boolean;
}

const RoomModal: React.FC<RoomModalProps> = ({ onSubmit, shouldOpen, showError = false }) => {
    const { openModal, updateModal, closeModal } = useModalContext();
    const [pseudo, setPseudo] = useState("");
    const [code, setCode] = useState("");
    const [localShowError, setLocalShowError] = useState(false);
    const isOpened = useRef(false);
    const lastContentRef = useRef<any>(null);

    const handleSubmit = () => {
        if (code.trim() === "000000") {
            setLocalShowError(true);
            setTimeout(() => setLocalShowError(false), 2000);
            return;
        }
        onSubmit(pseudo.trim(), code.trim());
        closeModal();
    };

    useEffect(() => {
        if (shouldOpen) {
            const newContent = {
                inputFields: [
                    {
                        id: "pseudo",
                        value: pseudo,
                        onChange: setPseudo,
                        placeholder: "Votre pseudo",
                        autoFocus: true,
                    },
                    {
                        id: "code",
                        value: code,
                        onChange: setCode,
                        placeholder: "Code de salle (optionnel)",
                        maxLength: 6,
                    },
                ],
                submitButton: {
                    label: code.trim() ? "Rejoindre" : "Créer une salle",
                    onClick: handleSubmit,
                    disabled: !pseudo.trim(),
                },
                isValid: pseudo.trim(),
                errorMessage: (showError || localShowError) ? "Code de salle invalide" : undefined,
            };

            if (JSON.stringify(newContent) !== JSON.stringify(lastContentRef.current)) {
                lastContentRef.current = newContent;
                if (!isOpened.current) {
                    isOpened.current = true;
                    openModal({
                        title: code.trim() ? "Rejoindre un salon" : "Créer un salon",
                        type: "form",
                        content: newContent,
                    });
                } else {
                    updateModal({
                        title: code.trim() ? "Rejoindre un salon" : "Créer un salon",
                        content: newContent,
                    });
                }
            }
        } else {
            if (isOpened.current) {
                closeModal();
                isOpened.current = false;
            }
        }
    }, [shouldOpen, pseudo, code, showError, localShowError, openModal, updateModal, closeModal, onSubmit]);

    return null;
};

export default RoomModal;

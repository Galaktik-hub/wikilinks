"use client";

import * as React from "react";
import {useModalContext} from "../ModalProvider.tsx";
import {useEffect, useRef, useState} from "react";

interface UsernameModalProps {
    onSubmit: (pseudo: string) => void;
    shouldOpen: boolean;
}

const UsernameModal: React.FC<UsernameModalProps> = ({onSubmit, shouldOpen}) => {
    const {openModal, updateModal, closeModal} = useModalContext();
    const [pseudo, setPseudo] = useState("");
    const isOpened = useRef(false);
    const lastContentRef = useRef<any>(null);

    useEffect(() => {
        if (shouldOpen) {
            // Construire le contenu du modal
            const newContent = {
                inputFields: [
                    {
                        id: "pseudo",
                        value: pseudo,
                        onChange: setPseudo,
                        placeholder: "Votre pseudo",
                        autoFocus: true,
                        maxLength: 25,
                    },
                ],
                submitButton: {
                    label: "Rejoindre",
                    onClick: () => {
                        if (pseudo.trim()) {
                            onSubmit(pseudo.trim());
                        }
                    },
                    disabled: !pseudo.trim(),
                },
                isValid: pseudo.trim(),
            };

            // Comparaison simple pour éviter de mettre à jour si le contenu n'a pas changé
            if (JSON.stringify(newContent) !== JSON.stringify(lastContentRef.current)) {
                lastContentRef.current = newContent;
                if (!isOpened.current) {
                    isOpened.current = true;
                    openModal({
                        title: "Rejoindre un salon",
                        type: "form",
                        content: newContent,
                    });
                } else {
                    updateModal({
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
    }, [shouldOpen, pseudo, openModal, updateModal, closeModal, onSubmit]);

    return null;
};

export default UsernameModal;

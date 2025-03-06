"use client";

import * as React from "react";
import {useModalContext} from "../ModalProvider.tsx";
import {useEffect, useRef, useState} from "react";

interface RoomModalProps {
    onSubmit: (pseudo: string, code: string) => void;
    shouldOpen: boolean;
}

// CE FICHIER EST TEMPORAIRE, A UTILISER POUR TESTER LA FONCTIONNALITÉ DE "CHAMBRES WEBSOCKET"

const RoomModal: React.FC<RoomModalProps> = ({ onSubmit, shouldOpen }) => {
    const { openModal, updateModal, closeModal } = useModalContext();
    const [pseudo, setPseudo] = useState("");
    const [code, setCode] = useState("");
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
                    },
                    {
                        id: "code",
                        value: code,
                        onChange: setCode,
                        placeholder: "Code de salle (6 chiffres)",
                        maxLength: 6,
                    },
                ],
                submitButton: {
                    label: "Rejoindre",
                    onClick: () => {
                        if (pseudo.trim() && /^\d{6}$/.test(code.trim())) {
                            onSubmit(pseudo.trim(), code.trim());
                            closeModal();
                        } else {
                            alert("Veuillez entrer un pseudo et un code valide à 6 chiffres.");
                        }
                    },
                    disabled: !(pseudo.trim() && /^\d{6}$/.test(code.trim())),
                },
                isValid: pseudo.trim() && /^\d{6}$/.test(code.trim()),
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
    }, [shouldOpen, pseudo, code, openModal, updateModal, closeModal, onSubmit]);

    return null;
};

export default RoomModal;

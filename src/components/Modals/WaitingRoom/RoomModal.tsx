"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { useModalContext } from "../ModalProvider.tsx";
import { useEffect, useRef, useState } from "react";

interface RoomModalProps {
    onSubmit: (pseudo: string, code: string) => void;
    shouldOpen: boolean;
}

// CE FICHIER EST TEMPORAIRE, A UTILISER POUR TESTER LA FONCTIONNALITÉ DE "CHAMBRES WEBSOCKET"

const RoomModal: React.FC<RoomModalProps> = ({ onSubmit, shouldOpen }) => {
    const { openModal, updateModal, closeModal } = useModalContext();
    const [pseudo, setPseudo] = useState("");
    const [code, setCode] = useState("");
    const [showPopup, setShowPopup] = useState(false);
    const isOpened = useRef(false);
    const lastContentRef = useRef<any>(null);

    //TEST DE POPUP D'ERREUR
    const handleSubmit = () => {
        if (code === "000000") {
            setShowPopup(true);
            setTimeout(() => setShowPopup(false), 2000);

        } else {
            onSubmit(pseudo.trim(), code.trim());
            closeModal();
        }
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
                        placeholder: "Code de salle (6 chiffres)",
                        maxLength: 6,
                    },
                ],
                submitButton: {
                    label: "Rejoindre",
                    onClick: handleSubmit,
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

    return (
        <>
            {/* Popup d'erreur s'affiche si le code est "000000". */}
            {showPopup &&
                createPortal(
                    <div className="fixed inset-0 flex items-center justify-center z-[9999]">
                        <div className="bg-red-600 text-white py-3 px-6 rounded-lg shadow-xl text-lg font-semibold">
                            Code de la partie invalide
                        </div>
                    </div>,
                    document.body
                )}
        </>
    );
};

export default RoomModal;

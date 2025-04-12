"use client";

import * as React from "react";
import CopySVG from "../../../../assets/WaitingRoom/CopySVG.tsx";
import QrCodeSVG from "../../../../assets/WaitingRoom/QrCodeSVG.tsx";
import {useModalContext} from "../../../Modals/ModalProvider.tsx";
import {QRCodeCanvas} from "qrcode.react";
import {usePopup} from "../../../../context/PopupContext.tsx";

interface GameCodeProps {
    code: number;
}

export const GameCode: React.FC<GameCodeProps> = ({code}) => {
    const {openModal, closeModal} = useModalContext();
    const {showPopup} = usePopup();

    const gameLink = `${window.location.origin}/?code=${code}`;

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(gameLink);
            showPopup("info", "Lien copié");
        } catch (err) {
            showPopup("error", "Échec de la copie");
            console.error("Échec de la copie :", err);
        }
    };

    const handleOpenQR = async () => {
        openModal({
            title: `Scanner le QR code`,
            type: "confirmation",
            content: {
                message: (
                    <div className="flex justify-center items-center">
                        <QRCodeCanvas value={gameLink} size={200} fgColor="#000000" bgColor="#ffffff" />
                    </div>
                ),
                cancelButton: {label: "Annuler", onClick: () => closeModal()},
                okButton: {
                    label: "OK",
                    onClick: () => {
                        closeModal();
                    },
                },
            },
        });
    };

    return (
        <div className="relative w-full">
            <section className="flex gap-4 justify-between items-center py-2 w-full">
                <h2 className="text-gray-400 text-lg">Code</h2>
                <div className="flex gap-2">
                    {/* Bouton copier le code (copie le lien d'invitation) */}
                    <button
                        onClick={handleCopy}
                        className="flex gap-2 items-center bg-blueSecondary hover:bg-blue-900  transition-colors duration-300 text-white py-2 px-4 rounded focus:outline-none"
                        aria-label={`Copier le code de jeu ${code}`}>
                        <span className="font-bold">{code}</span>
                        <CopySVG />
                    </button>

                    {/* Bouton QR Code */}
                    <button
                        onClick={() => handleOpenQR()}
                        className="flex items-center justify-center bg-gray-700 hover:bg-gray-800 transition-colors duration-300 text-white p-2 rounded focus:outline-none"
                        aria-label="Afficher le QR Code">
                        <QrCodeSVG />
                    </button>
                </div>
            </section>
        </div>
    );
};

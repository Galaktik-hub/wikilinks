"use client";

import * as React from "react";
import CopySVG from "../../../../assets/WaitingRoom/CopySVG.tsx";
import {PopupButton} from "../../../Buttons/WaitingRoom/PopupButton.tsx";

interface GameCodeProps {
    code: number;
}

export const GameCode: React.FC<GameCodeProps> = ({ code }) => {
    const [popupVisible, setPopupVisible] = React.useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(code.toString());
            setPopupVisible(true);
            setTimeout(() => {
                setPopupVisible(false);
            }, 1500);
        } catch (err) {
            console.error("Échec de la copie du code :", err);
        }
    };

    return (
        <div className="relative w-full">
            <section className="flex gap-10 justify-between items-center py-4 w-full">
                <h2 className="text-gray-400 text-lg">Code</h2>
                <button
                    onClick={handleCopy}
                    className="flex gap-2 items-center bg-blue-600 hover:bg-blue-700 transition-colors duration-300 text-white py-2 px-4 rounded focus:outline-none"
                    aria-label={`Copier le code de jeu ${code}`}
                >
                    <span className="font-bold">{code}</span>
                    <CopySVG />
                </button>
            </section>

            {popupVisible && (
                <div className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none">
                    <PopupButton text="Copié !" color="green" />
                </div>
            )}
        </div>
    );
};

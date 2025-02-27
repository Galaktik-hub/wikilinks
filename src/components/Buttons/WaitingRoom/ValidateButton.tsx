"use client";

import * as React from "react";
import PlaySVG from "../../../assets/WaitingRoom/PlaySVG.tsx";

const ValidateButton: React.FC<{ onClick?: () => void; disabled?: boolean }> = ({ onClick, disabled = false }) => {
    return (
        <div className="flex justify-center w-full mb-4 mt-3">
            <button
                onClick={onClick}
                disabled={disabled}
                className="w-full h-16 flex items-center justify-center text-xl font-bold text-white bg-green-600 rounded-lg shadow-[0px_4px_6px_rgba(16,185,64,0.5)] hover:bg-green-700 transition-colors"
                type="button"
                aria-label="Lancer la partie"
            >
                <span className="z-10">Lancer la partie</span>
                <PlaySVG className="ml-2 w-6 h-6 text-white" />
            </button>
        </div>
    );
};

export default ValidateButton;

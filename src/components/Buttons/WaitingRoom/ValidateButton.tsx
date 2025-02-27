"use client";

import * as React from "react";

const ValidateButton: React.FC<{ onClick?: () => void; disabled?: boolean }> = ({ onClick, disabled = false }) => {
    return (
        <div className="flex justify-center">
            <button
                onClick={onClick}
                disabled={disabled}
                className="w-full h-16 relative flex items-center justify-center text-xl font-bold text-white bg-green-600 rounded-lg shadow-[0px_4px_6px_rgba(16,185,64,0.5)] hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 neon-effect"
                type="button"
                aria-label="Lancer la partie"
            >
                <span className="z-10">Lancer la partie</span>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="absolute right-4 w-6 h-6 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 3l14 9-14 9V3z"
                    />
                </svg>
            </button>
        </div>
    );
};

export default ValidateButton;

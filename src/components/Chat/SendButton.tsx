"use client";

import SendSVG from "../../assets/WaitingRoom/SendSVG.tsx";

interface SendButtonProps {
    onClick: () => void;
    disabled: boolean;
}

export function SendButton({onClick, disabled}: SendButtonProps) {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            aria-disabled={disabled}
            className={`flex gap-2.5 items-center self-stretch px-2 py-3 my-auto w-8 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                disabled ? "bg-gray-400 cursor-not-allowed" : "bg-blueSecondary hover:bg-blue-900 focus:ring-bluePrimary"
            }`}
            aria-label="Send message">
            <SendSVG />
        </button>
    );
}

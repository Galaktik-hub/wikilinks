"use client";

import * as React from "react";

interface SmallButtonProps {
    text: string;
    color: "green" | "red";
}

export const PopupButton: React.FC<SmallButtonProps> = ({ text, color }) => {
    const bgColor = color === "green" ? "bg-green-600" : "bg-red-600";

    return (
        <div className={`${bgColor} text-white py-1 px-4 rounded shadow-lg`}>
            {text}
        </div>
    );
};

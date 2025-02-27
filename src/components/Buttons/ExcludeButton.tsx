"use client";

import * as React from "react";
import ExcludeSVG from "../../assets/ExcludeSVG.tsx";

const ExcludeButton: React.FC<{ onClick?: () => void; disabled?: boolean }> = ({ onClick, disabled = false }) => {

    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className="w-[48px] h-[48px] bg-gray-800 rounded-lg border-2 border-solid flex justify-center items-center"
            style={{ borderColor: "#EF4444" }}
        >
            <ExcludeSVG />
        </button>
    );
};

export default ExcludeButton;

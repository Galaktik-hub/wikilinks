"use client";

import * as React from "react";
import InventorySVG from "../../../assets/Game/InventorySVG.tsx";
import {useEffect, useState} from "react";

const InventoryButton: React.FC<{ onClick?: () => void; disabled?: boolean }> = ({ onClick, disabled = false }) => {
    const [showText, setShowText] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setShowText(false), 10000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className="inline-flex gap-2 items-center p-4 bg-blue-700 rounded-lg cursor-pointer h-[50px]"
        >
            <InventorySVG />
            {showText && <span className="text-base text-white max-md:text-base max-sm:text-sm">
                Inventaire
            </span>}
        </button>
    );
};

export default InventoryButton;

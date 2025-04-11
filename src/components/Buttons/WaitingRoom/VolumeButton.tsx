"use client";

import * as React from "react";
import VolumeSVG from "../../../assets/WaitingRoom/VolumeSVG.tsx";

interface VolumeButtonProps {
    onClick?: (newMuted: boolean) => void;
    muted: boolean;
    disabled?: boolean;
}

const VolumeButton: React.FC<VolumeButtonProps> = ({onClick, muted, disabled = false}) => {
    const handleClick = () => {
        if (onClick) {
            onClick(!muted);
        }
    };

    return (
        <button
            onClick={handleClick}
            disabled={disabled}
            className="w-[48px] h-[48px] bg-gray-800 rounded-lg border-2 border-solid flex justify-center items-center"
            style={{borderColor: "#00F7FF"}}>
            <VolumeSVG muted={muted} />
        </button>
    );
};

export default VolumeButton;

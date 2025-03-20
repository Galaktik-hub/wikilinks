"use client";

import * as React from "react";
import VolumeSVG from "../../../assets/WaitingRoom/VolumeSVG.tsx";
import {useState} from "react";

const VolumeButton: React.FC<{ onClick?: (muted: boolean) => void; disabled?: boolean }> = ({ onClick, disabled = false }) => {
    const [muted, setMuted] = useState(false);

    const handleClick = () => {
        const newMuted = !muted;
        setMuted(newMuted);
        if (onClick) onClick(newMuted);
    };

    return (
        <button
            onClick={handleClick}
            disabled={disabled}
            className="w-[48px] h-[48px] bg-gray-800 rounded-lg border-2 border-solid flex justify-center items-center"
            style={{ borderColor: "#00F7FF" }}
        >
            <VolumeSVG muted={muted} />
        </button>
    );
};

export default VolumeButton;

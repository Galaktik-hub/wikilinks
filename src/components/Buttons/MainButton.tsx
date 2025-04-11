import React from "react";

interface MainButtonProps {
    color: string;
    onClick: () => void;
    children: React.ReactNode;
    className?: string;
    ariaLabel?: string;
    disabled?: boolean;
}

const MainButton: React.FC<MainButtonProps> = ({color, onClick, children, className, ariaLabel, disabled}) => {
    return (
        <button
            className={`flex gap-1 items-center justify-center font-bold text-white rounded-lg transition-colors py-3 px-10 dynamic-shadow dynamic-shadow-hover ${className}`}
            style={{"--shadow-color": color} as React.CSSProperties}
            onClick={onClick}
            type="button"
            aria-label={ariaLabel}
            disabled={disabled}>
            {children}
        </button>
    );
};

export default MainButton;

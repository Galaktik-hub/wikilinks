import * as React from "react";

interface CloseSVGProps {
    onClick: () => void; // Déclarez que CloseSVG accepte une fonction onClick
}

const CloseSVG: React.FC<CloseSVGProps> = ({onClick}) => {
    return (
        <svg width="25" height="26" viewBox="0 0 25 26" fill="none" xmlns="http://www.w3.org/2000/svg" onClick={onClick}>
            <path
                d="M6.66683 20.2917L5.2085 18.8333L11.0418 13L5.2085 7.16667L6.66683 5.70834L12.5002 11.5417L18.3335 5.70834L19.7918 7.16667L13.9585 13L19.7918 18.8333L18.3335 20.2917L12.5002 14.4583L6.66683 20.2917Z"
                fill="#9CA3AF"
            />
        </svg>
    );
};

export default CloseSVG;

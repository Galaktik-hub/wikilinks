import * as React from "react";
import ExitSVG from "../../../assets/WaitingRoom/ExitSVG.tsx";
import MainButton from "../MainButton.tsx";

type DeleteButtonProps = {
    isHost: boolean;
    onClick?: () => void;  
};

const ExitButton: React.FC<DeleteButtonProps> = ({ isHost, onClick }) => {
    const handleClick = React.useCallback(() => {
        console.log("ExitButton clicked");  
        if (onClick) {
            onClick();
        }
    }, [onClick]);

    return (
        <MainButton
            color="220, 38, 38"
            className="bg-red-600"
            ariaLabel={isHost ? "Supprimer" : "Quitter"}
            onClick={handleClick}
        >
            <span className="text-center text-xl">{isHost ? "Supprimer" : "Quitter"}</span>
            {!isHost ? <ExitSVG className="ml-2 w-6 h-6 text-white" /> : null}
        </MainButton>
    );
};

export default ExitButton;

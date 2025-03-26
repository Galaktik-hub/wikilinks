import * as React from "react";
import ExitSVG from "../../../assets/WaitingRoom/ExitSVG.tsx";

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
        <div className="flex justify-center">
            <button
                className="w-full flex items-center justify-center text-xl font-bold text-white bg-red-600 rounded-lg shadow-[0px_0px_10px_rgba(185,39,16,0.5)] hover:shadow-[0px_0px_15px_rgba(185,39,16,1)] transition-colors pt-1.5 pb-1.5 pr-10 pl-10"
                type="button"
                aria-label={isHost ? "Supprimer" : "Quitter"}
                onClick={handleClick}
            >
                <span className="">{isHost ? "Supprimer" : "Quitter"}</span>
                {!isHost ? <ExitSVG className="ml-2 w-6 h-6 text-white" /> : null}
            </button>
        </div>
    );
};

export default ExitButton;

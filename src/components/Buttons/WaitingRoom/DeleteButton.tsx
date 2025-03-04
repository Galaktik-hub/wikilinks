import * as React from "react";
import ExitSVG from "../../../assets/WaitingRoom/ExitSVG.tsx";

type DeleteButtonProps = {
    isHost: boolean;
};

const DeleteButton: React.FC<DeleteButtonProps> = ({ isHost }) => {
    return (
        <div className="flex justify-center w-[360px] mb-4 mt-3">
            <button
                className="w-full h-16 flex items-center justify-center text-xl font-bold text-white bg-red-600 rounded-lg shadow-[0px_0px_10px_rgba(185,39,16,0.5)] hover:shadow-[0px_0px_15px_rgba(185,39,16,1)] transition-colors"
                type="button"
                aria-label={isHost ? "Supprimer" : "Quitter"}
            >
                <span className="">{isHost ? "Supprimer" : "Quitter"}</span>
                {!isHost ? <ExitSVG className="ml-2 w-6 h-6 text-white" /> : null}
            </button>
        </div>
    );
};

export default DeleteButton;

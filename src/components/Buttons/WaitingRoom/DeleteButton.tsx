import * as React from "react";

type DeleteButtonProps = {
    isAdmin: boolean;
};

const DeleteButton: React.FC<DeleteButtonProps> = ({ isAdmin }) => {
    return (
        <div className="flex justify-center w-[360px] mb-4 mt-3">
            <button
                className="w-full h-16 flex items-center justify-center text-xl font-bold text-white bg-red-600 rounded-lg shadow-[0px_0px_10px_rgba(185,39,16,0.5)] hover:shadow-[0px_0px_15px_rgba(185,39,16,1)] transition-colors"
                type="button"
                aria-label={isAdmin ? "Supprimer" : "Quitter"}
            >
                <span className="">{isAdmin ? "Supprimer" : "Quitter"}</span>
            </button>
        </div>
    );
};

export default DeleteButton;

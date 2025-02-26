"use client";

import * as React from "react";

type DeleteButtonProps = {
    isAdmin: boolean;
};

const DeleteButton: React.FC<DeleteButtonProps> = ({ isAdmin }) => {
    return (
        <div className="flex justify-center">
            <button
                className="w-full h-16 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg shadow-[0px_4px_6px_rgba(185,39,16,0.5)] transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                type="button"
                aria-label={isAdmin ? "Supprimer" : "Quitter"}
            >
                <span>
                    {isAdmin ? "Supprimer" : "Quitter"}
                </span>
            </button>
        </div>
    );
};

export default DeleteButton;

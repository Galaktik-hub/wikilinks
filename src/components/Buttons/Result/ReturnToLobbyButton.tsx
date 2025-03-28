import * as React from "react";
import {useNavigate} from "react-router-dom";
import DoorSVG from "../../../assets/Result/DoorSVG.tsx";

const ReturnToLobbyButton: React.FC = () => {
    const navigate = useNavigate();

    const handleClick = (() => {
        navigate("/room");
    });

    return (
        <div className="flex gap-1 justify-center items-center">
            <button
                className="w-full flex gap-1 items-center justify-center font-bold text-white bg-green-600 shadow-[0px_0px_10px_rgba(16,185,64,0.5)] hover:shadow-[0px_0px_15px_rgba(16,185,64,1)] rounded-lg transition-colors py-3 px-10"
                type="button"
                onClick={handleClick}
            >
                <span className="text-center text-xl">Retour au salon</span>
                <DoorSVG />
            </button>
        </div>
    );
};

export default ReturnToLobbyButton;
import * as React from "react";
import {useNavigate} from "react-router-dom";
import DoorSVG from "../../../assets/Result/DoorSVG.tsx";
import MainButton from "../MainButton.tsx";
import {useGameContext} from "../../../context/GameContext.tsx";

const ReturnToLobbyButton: React.FC = () => {
    const navigate = useNavigate();
    const { setIsGameOver } = useGameContext();

    const handleClick = () => {
        setIsGameOver(false);
        navigate("/room");
    };

    return (
        <MainButton color="22, 163, 74" className="bg-green-600" onClick={handleClick}>
            <span className="text-center text-xl">Retour au salon</span>
            <DoorSVG />
        </MainButton>
    );
};

export default ReturnToLobbyButton;

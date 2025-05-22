import * as React from "react";
import ExitSVG from "../../../assets/WaitingRoom/ExitSVG.tsx";
import MainButton from "../MainButton.tsx";
import {useCallback} from "react";
import {useWebSocket} from "../../../context/WebSocketContext.tsx";
import {useNavigate} from "react-router-dom";
import {usePlayersContext} from "../../../context/PlayersContext";

type DeleteButtonProps = {
    isHost: boolean;
};

const ExitButton: React.FC<DeleteButtonProps> = (props: DeleteButtonProps) => {
    const {isHost} = props;
    const socketContext = useWebSocket();
    const playerContext = usePlayersContext();
    const navigate = useNavigate();

    const handleClick = useCallback(() => {
        if (isHost) {
            socketContext.send({kind: "close_room"});
        } else {
            socketContext.send({kind: "disconnect"});
        }
        playerContext.exit();
        navigate("/");
    }, [isHost, navigate, socketContext, playerContext]);

    return (
        <MainButton color="220, 38, 38" className="bg-red-600" ariaLabel={isHost ? "Supprimer" : "Quitter"} onClick={handleClick}>
            <span className="text-center text-xl">{isHost ? "Supprimer" : "Quitter"}</span>
            <ExitSVG className="ml-2 w-6 h-6 text-white" />
        </MainButton>
    );
};

export default ExitButton;

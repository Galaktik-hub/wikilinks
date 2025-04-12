import * as React from "react";
import ExitSVG from "../../../assets/WaitingRoom/ExitSVG.tsx";
import MainButton from "../MainButton.tsx";
import {SocketContext} from "../../../context/SocketContext.tsx";
import {useCallback} from "react";

type DeleteButtonProps = {
    isHost: boolean;
    onClick?: () => void;
};

const ExitButton: React.FC<DeleteButtonProps> = ({isHost}) => {
    const socket = React.useContext(SocketContext);

    const handleClick = useCallback(() => {
        if (isHost) {
            socket?.sendMessageToServer({kind: "close_room"});
            window.location.href = "/";
        } else {
            socket?.sendMessageToServer({kind: "disconnect"});
            window.location.href = "/";
        }
    }, [isHost, socket]);

    return (
        <MainButton color="220, 38, 38" className="bg-red-600" ariaLabel={isHost ? "Supprimer" : "Quitter"} onClick={handleClick}>
            <span className="text-center text-xl">{isHost ? "Supprimer" : "Quitter"}</span>
            <ExitSVG className="ml-2 w-6 h-6 text-white" />
        </MainButton>
    );
};

export default ExitButton;

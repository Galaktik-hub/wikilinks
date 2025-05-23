import * as React from "react";
import ExitSVG from "../../../assets/WaitingRoom/ExitSVG.tsx";
import MainButton from "../MainButton.tsx";
import {useWebSocket} from "../../../context/WebSocketContext.tsx";
import {useNavigate} from "react-router-dom";
import {usePlayersContext} from "../../../context/PlayersContext";
import {useModalContext} from "../../Modals/ModalProvider";

type DeleteButtonProps = {
    isHost: boolean;
};

const ExitButton: React.FC<DeleteButtonProps> = (props: DeleteButtonProps) => {
    const {isHost} = props;
    const socketContext = useWebSocket();
    const playerContext = usePlayersContext();
    const navigate = useNavigate();
    const {openModal, closeModal} = useModalContext();

    const title = isHost ? "Supprimer le salon" : "Quitter le salon";
    const message = isHost
        ? "Voulez-vous vraiment supprimer le salon ? Tous les joueurs seront redirigés vers l'accueil."
        : "Voulez-vous vraiment quitter le salon ?";

    const handleClick = () => {
        openModal({
            title: title,
            type: "confirmation",
            content: {
                message: message,
                cancelButton: {label: "Annuler", onClick: () => closeModal()},
                okButton: {
                    label: "Confirmer",
                    onClick: () => {
                        handleConfirm();
                        closeModal();
                    },
                },
            },
        });
    };

    const handleConfirm = () => {
        if (isHost) {
            socketContext.send({kind: "close_room"});
        } else {
            socketContext.send({kind: "disconnect"});
        }
        playerContext.exit();
        navigate("/");
    };

    return (
        <MainButton color="220, 38, 38" className="bg-red-600" ariaLabel={isHost ? "Supprimer" : "Quitter"} onClick={handleClick}>
            <span className="text-center text-xl">{isHost ? "Supprimer" : "Quitter"}</span>
            <ExitSVG className="ml-2 w-6 h-6 text-white" />
        </MainButton>
    );
};

export default ExitButton;

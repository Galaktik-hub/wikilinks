"use client";

import React, {useState, useEffect, useContext} from "react";
import {LobbyCard} from "./LobbyCard.tsx";
import {useNavigate, useLocation} from "react-router-dom";
import UsernameModal from "../../Modals/WaitingRoom/UsernameModal";
import {IconPlus} from "@tabler/icons-react";
import {SocketContext} from "../../../context/SocketContext.tsx";
import {usePopup} from "../../../context/PopupContext.tsx";

export const CreateOrJoinGame: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const socket = useContext(SocketContext);
    const [showUsernameModal, setShowUsernameModal] = useState(false);
    const [tempRoomCode, setTempRoomCode] = useState(-1);
    const [roomCodeInput, setRoomCodeInput] = useState("");
    const [isCheckingRoom, setIsCheckingRoom] = useState(false);
    const {showPopup} = usePopup();

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const roomCode = urlParams.get("code");

        if (roomCode) {
            setRoomCodeInput(roomCode); // Remplit le champ d'entrée avec le code
            handleJoinGame(roomCode); // Vérifie et rejoint la salle
        }
    }, [location.search]);

    // Function to create a game with just a username
    const handleCreateGame = (username: string) => {
        if (!username.trim()) return;

        if (username.length > 25) {
            showPopup("error", "Le pseudo ne doit pas dépasser 25 caractères");
            return;
        }

        if (username.match(/^[a-zA-Z0-9_]+$/) === null) {
            showPopup("error", "Le pseudo ne doit contenir que des lettres, chiffres et underscores");
            return;
        }

        if (socket?.setUsername && socket?.createGameSession) {
            socket.setUsername(username);

            socket.createGameSession({
                timeLimit: 10,
                numberOfArticles: 4,
                maxPlayers: 5,
                type: "private",
                leaderName: username,
            });

            // Reste connecté et redirige vers la salle d'attente
            navigate("/room");
        }
    };

    const handleJoinGame = async (roomCode: string) => {
        const parsedRoomCode = parseInt(roomCode, 10);

        setIsCheckingRoom(true);
        try {
            const roomExists = await socket?.checkRoomExists(parsedRoomCode);

            if (roomExists) {
                setTempRoomCode(parsedRoomCode);
                setShowUsernameModal(true);
            } else {
                showPopup("error", "Cette partie n'existe pas");
            }
        } catch (err) {
            showPopup("error", err instanceof Error ? err.message : "Erreur lors de la vérification");
        } finally {
            setIsCheckingRoom(false);
        }
    };

    // Lors de la soumission du username dans le modal pour rejoindre une partie existante
    const handleUsernameSubmit = async (username: string) => {
        if (!username.trim()) return;

        if (username.length > 25) {
            showPopup("error", "Le pseudo ne doit pas dépasser 25 caractères");
            return;
        }

        if (username.match(/^[a-zA-Z0-9_]+$/) === null) {
            showPopup("error", "Le pseudo ne doit contenir que des lettres, chiffres et underscores");
            return;
        }

        const parsedRoomCode = parseInt(roomCodeInput, 10);

        const usernameTaken = await socket?.checkUsernameTaken(username, parsedRoomCode);

        if (usernameTaken) {
            showPopup("error", "Ce pseudo est déjà utilisé");
            return;
        }

        const hasStarted = await socket?.checkGameHasStarted(parsedRoomCode);

        if (hasStarted) {
            showPopup("error", "Cette partie a déjà commencé");
            setShowUsernameModal(false);
            setTempRoomCode(-1);
            return;
        }

        if (socket?.setUsername && socket?.joinGameSession) {
            socket.setUsername(username);

            socket.joinGameSession({
                sessionId: tempRoomCode,
                playerName: username,
            });

            setShowUsernameModal(false);
            setTempRoomCode(-1);

            // Reste connecté et redirige vers la salle d'attente
            navigate("/room");
        }
    };

    return (
        <section className="flex flex-wrap gap-4 justify-center items-start">
            <LobbyCard
                inputPlaceholder="Saisissez votre pseudo"
                buttonText="Créer une partie"
                maxLength={25}
                icon={<IconPlus size={18} color="white" />}
                value=""
                onChange={() => {}}
                onSubmit={handleCreateGame}
            />
            <LobbyCard
                inputPlaceholder="Entrez le code de la partie"
                buttonText={isCheckingRoom ? "Chargement..." : "Rejoindre la partie"}
                maxLength={6}
                onSubmit={handleJoinGame}
                value={roomCodeInput} // Utilisez l'état pour la valeur du champ
                onChange={e => setRoomCodeInput(e.target.value)}
            />

            {/* Modal pour renseigner le username lors du join */}
            <UsernameModal onSubmit={handleUsernameSubmit} shouldOpen={showUsernameModal} />
        </section>
    );
};

export default CreateOrJoinGame;

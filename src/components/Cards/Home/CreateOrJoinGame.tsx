"use client";

import React, { useState, useEffect, useContext } from "react";
import { LobbyCard } from "./LobbyCard.tsx";
import { useNavigate, useLocation } from "react-router-dom";
import UsernameModal from "../../Modals/WaitingRoom/UsernameModal";
import {IconPlus} from "@tabler/icons-react";
import {SocketContext} from "../../../context/SocketContext.tsx";

export const CreateOrJoinGame: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const socket = useContext(SocketContext);
    const [showUsernameModal, setShowUsernameModal] = useState(false);
    const [tempRoomCode, setTempRoomCode] = useState(-1);
    const [roomCodeInput, setRoomCodeInput] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [isCheckingRoom, setIsCheckingRoom] = useState(false);

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

        if (socket?.setUsername && socket?.setRoomCode && socket?.createGameSession) {
            socket.setUsername(username);
            socket.setRoomCode(-1);

            // Envoi de l'event de création vers le serveur avec les paramètres requis
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

    // Rejoindre une partie : on vérifie d'abord si le code existe
    const handleJoinGame = async (roomCode: string) => {
        const parsedRoomCode = parseInt(roomCode, 10);

        if (parsedRoomCode < 100000 || parsedRoomCode > 999999) {
            setError("Code de partie invalide");
            setTimeout(() => setError(null), 3000);
            return;
        }

        setIsCheckingRoom(true);
        setError(null);
        try {
            // Use the context function to check if the room exists
            const roomExists = await socket?.checkRoomExists(parsedRoomCode);

            if (roomExists) {
                // Si la room existe, on sauvegarde le code temporairement et on affiche le modal pour renseigner le username
                setTempRoomCode(parsedRoomCode);
                setShowUsernameModal(true);
            } else {
                setError("Cette partie n'existe pas");
                setTimeout(() => setError(null), 3000);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "Erreur lors de la vérification");
            setTimeout(() => setError(null), 3000);
        } finally {
            setIsCheckingRoom(false);
        }
    };

    // Lors de la soumission du username dans le modal pour rejoindre une partie existante
    const handleUsernameSubmit = (username: string) => {
        if (!username.trim()) return;

        if (socket?.setUsername && socket?.setRoomCode && socket?.joinGameSession) {
            socket.setUsername(username);
            socket.setRoomCode(-1);

            // Envoi de l'event de join au serveur
            socket.joinGameSession({
                sessionId: tempRoomCode,
                playerName: username,
            });

            // Reste connecté et redirige vers la salle d'attente
            navigate("/room");
        }
        // Réinitialise le modal et le code temporaire
        setShowUsernameModal(false);
        setTempRoomCode(-1);
    };

    return (
        <section className="flex flex-wrap gap-4 justify-center items-start">
            <LobbyCard
                inputPlaceholder="Saisissez votre pseudo"
                buttonText="Créer une partie"
                icon={<IconPlus size = {18} color = "white"/>}
                value=""
                onChange={() => {}}
                onSubmit={handleCreateGame}
                error={null}
            />
            <LobbyCard
                inputPlaceholder="Entrez le code de la partie"
                buttonText={isCheckingRoom ? "Chargement..." : "Rejoindre la partie"}
                maxLength={6}
                onSubmit={handleJoinGame}
                error={error}
                value={roomCodeInput} // Utilisez l'état pour la valeur du champ
                onChange={(e) => setRoomCodeInput(e.target.value)}
            />

            {/* Modal pour renseigner le username lors du join */}
            <UsernameModal onSubmit={handleUsernameSubmit} shouldOpen={showUsernameModal} />
        </section>
    );
};

export default CreateOrJoinGame;

"use client";

import React, { useState } from "react";
import { LobbyCard } from "./LobbyCard.tsx";
import { useNavigate } from "react-router-dom";
import UsernameModal from "../../Modals/WaitingRoom/UsernameModal";
import { ChatContext } from "../../../context/ChatContext";
import { useContext } from "react";

export const CreateOrJoinGame: React.FC = () => {
    const navigate = useNavigate();
    const chat = useContext(ChatContext);
    const [showUsernameModal, setShowUsernameModal] = useState(false);
    const [tempRoomCode, setTempRoomCode] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [isCheckingRoom, setIsCheckingRoom] = useState(false);

    // Function to create a game with just a username
    const handleCreateGame = (username: string) => {
        if (!username.trim()) {
            return;
        }

        // Use ChatContext to create a room
        if (chat?.setUsername) {
            chat.setUsername(username);
            chat.setRoomCode(null); // null indicates to create a new room

            // Redirect to the waiting room
            navigate("/room");
        }
    };

    // Function to check if a room exists and open the username modal
    const handleJoinGame = async (roomCode: string) => {
        if (!roomCode.trim()) {
            return;
        }

        // Invalid code for testing
        if (roomCode === "000000") {
            setError("Invalid room code");
            setTimeout(() => setError(null), 3000);
            return;
        }

        // Check if the room exists
        setIsCheckingRoom(true);
        setError(null);

        try {
            // Use the context function to check if the room exists
            const roomExists = await chat?.checkRoomExists(roomCode);
            
            if (roomExists) {
                // The room exists, open the modal for the username
                setTempRoomCode(roomCode);
                setShowUsernameModal(true);
            } else {
                // The room doesn't exist
                setError("This room doesn't exist");
                setTimeout(() => setError(null), 3000);
            }
        } catch (err) {
            // Handle errors
            setError(err instanceof Error ? err.message : "Error checking room existence");
            setTimeout(() => setError(null), 3000);
        } finally {
            setIsCheckingRoom(false);
        }
    };

    // Function called when the user submits their username in the modal
    const handleUsernameSubmit = (username: string) => {
        if (!username.trim() || !tempRoomCode.trim()) {
            return;
        }

        // Use ChatContext to join the room
        if (chat?.setUsername && chat?.setRoomCode) {
            chat.setUsername(username);
            chat.setRoomCode(tempRoomCode);

            // Redirect to the waiting room
            navigate("/room");
        }

        // Reset
        setShowUsernameModal(false);
        setTempRoomCode("");
    };

    return (
        <section className="flex flex-wrap gap-4 justify-center items-start">
            <LobbyCard
                inputPlaceholder="Saisissez votre pseudo"
                buttonText="Créer une partie"
                buttonIcon={true}
                onSubmit={handleCreateGame}
                error={null}
            />
            <LobbyCard
                inputPlaceholder="Entrez le code de la partie"
                buttonText={isCheckingRoom ? "Chargement..." : "Rejoindre la partie"}
                maxLength={6}
                onSubmit={handleJoinGame}
                error={error}
            />

            {/* Modal to ask for username when joining a game */}
            <UsernameModal
                onSubmit={handleUsernameSubmit}
                shouldOpen={showUsernameModal}
            />
        </section>
    );
};

export default CreateOrJoinGame;

"use client";
import React, {useState, useEffect, useContext} from "react";
import {PublicGameCard} from "../../Cards/Home/PublicGameCard.tsx";
import {SocketContext} from "../../../context/SocketContext.tsx";
import {IconRefresh} from "@tabler/icons-react";

// Interface pour les sessions reçues du serveur
interface GameSession {
    id: number;
    type: string;
    playerCount: number;
    maxPlayers: number;
    leaderName: string;
    timeLimit: number;
    numberOfArticles: number;
}

// Interface pour les jeux à afficher
interface Game {
    hostName: string;
    playerCount: number;
    maxPlayers: number;
    gameCode: string;
}

export const PublicGamesList: React.FC = () => {
    const socket = useContext(SocketContext);
    const [games, setGames] = useState<Game[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // Référence pour suivre les messages déjà traités
    const processedMessagesRef = React.useRef<Set<string>>(new Set());

    // Fonction pour demander les sessions
    const fetchSessions = () => {
        if (socket?.isConnected && socket?.sendMessageToServer) {
            setLoading(true);
            setError(null);
            socket.sendMessageToServer({kind: "get_all_sessions"});

            setTimeout(() => {
                setLoading(false);
            }, 2000);
        } else {
            setError("Socket non disponible");
        }
    };

    // Traiter les messages reçus via le SocketContext
    useEffect(() => {
        if (socket?.messages && socket.messages.length > 0) {
            // Parcourir les messages pour trouver les sessions
            for (let i = 0; i < socket.messages.length; i++) {
                const message = socket.messages[i];

                // Créer un identifiant unique pour ce message
                const messageId = JSON.stringify(message);

                // Vérifier si ce message a déjà été traité
                if (processedMessagesRef.current.has(messageId)) {
                    continue; // Message déjà traité, passer au suivant
                }

                if (message.kind === "all_sessions" && Array.isArray(message.sessions)) {
                    setLoading(false);
                    console.log(`Reçu ${message.sessions.length} sessions`);

                    // Marquer le message comme traité
                    processedMessagesRef.current.add(messageId);

                    if (message.sessions.length > 0) {
                        // Transformer les sessions en format Game
                        const activeSessions = message.sessions.map((session: GameSession) => ({
                            hostName: session.leaderName,
                            playerCount: session.playerCount,
                            maxPlayers: session.maxPlayers,
                            gameCode: session.id.toString(),
                        }));

                        setGames(activeSessions);
                    } else {
                        setGames([]);
                    }

                    // Arrêter la recherche après avoir trouvé un message all_sessions
                    break;
                }
            }
        }
    }, [socket?.messages]);

    // Demander les sessions au chargement initial et configurer l'intervalle
    useEffect(() => {
        if (socket?.isConnected) {
            fetchSessions();
        }
    }, [socket?.isConnected]);

    return (
        <section className="flex flex-col items-center py-6 px-2.5 w-full">
            <div className="flex justify-between items-center w-full px-2.5 mb-4">
                <div className="title-block gap-2">
                    Parties publiques
                    <button
                        className="p-2 text-white rounded hover:bg-blue-600 transition-colors cursor-pointer"
                        title="Rafraîchir"
                        onClick={fetchSessions}
                        disabled={loading}>
                        <IconRefresh className={loading ? "animate-spin" : ""} style={{animationDirection: "reverse"}} />
                    </button>
                </div>
            </div>

            {error && <div className="w-full p-4 mb-4 bg-red-100 text-red-700 rounded">{error}</div>}

            <div className="flex flex-wrap gap-5 justify-center items-start mt-5 w-full max-md:max-w-full">
                {games.map((game, index) => (
                    <PublicGameCard key={index} {...game} onJoin={() => {}} />
                ))}
            </div>
        </section>
    );
};

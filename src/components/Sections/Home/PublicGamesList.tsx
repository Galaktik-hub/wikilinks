"use client";
import React, {useState, useEffect, useContext} from "react";
import {PublicGameCard} from "../../Cards/Home/PublicGameCard.tsx";
import {SocketContext} from "../../../context/SocketContext.tsx";

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

    // Référence pour stocker l'ID de l'intervalle
    const intervalRef = React.useRef<NodeJS.Timeout | null>(null);

    // Référence pour suivre les messages déjà traités
    const processedMessagesRef = React.useRef<Set<string>>(new Set());

    // Fonction pour demander les sessions
    const fetchSessions = () => {
        if (socket?.isConnected && socket?.sendMessageToServer) {
            setLoading(true);
            setError(null);
            socket.sendMessageToServer({kind: "get_all_sessions"});

            // Timeout pour éviter un état de chargement infini
            setTimeout(() => {
                if (loading) {
                    setLoading(false);
                }
            }, 5000);
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

            // Configurer un intervalle pour rafraîchir les sessions toutes les 60 secondes
            intervalRef.current = setInterval(fetchSessions, 60000);
        }

        // Nettoyer les ressources lors du démontage
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };
    }, [socket?.isConnected]);

    return (
        <section className="flex flex-col items-center py-6 px-2.5 w-full">
            <div className="flex justify-between items-center w-full px-2.5 mb-4">
                <div className="title-block">Parties publiques</div>
                <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors" onClick={fetchSessions} disabled={loading}>
                    {loading ? "Chargement..." : "Rafraîchir"}
                </button>
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

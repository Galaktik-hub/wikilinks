"use client";
import React, {useState, useEffect} from "react";
import {PublicGameCard} from "../../Cards/Home/PublicGameCard.tsx";
import UsernameModal from "../../Modals/WaitingRoom/UsernameModal.tsx";
import {IconRefresh} from "@tabler/icons-react";
import {usePopup} from "../../../context/PopupContext.tsx";
import {useNavigate} from "react-router-dom";
import {useWebSocket} from "../../../context/WebSocketContext.tsx";
import {useGameContext} from "../../../context/GameContext.tsx";

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
    const socketContext = useWebSocket();
    const gameContext = useGameContext();
    const navigate = useNavigate();
    const {showPopup} = usePopup();

    const [games, setGames] = useState<Game[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // États pour la logique de rejoindre une partie
    const [showUsernameModal, setShowUsernameModal] = useState(false);
    const [tempRoomCode, setTempRoomCode] = useState(-1);
    const [roomCodeInput, setRoomCodeInput] = useState("");

    // Référence pour suivre les messages déjà traités
    const processedMessagesRef = React.useRef<Set<string>>(new Set());

    // Fonction pour demander les sessions
    const fetchSessions = () => {
        if (socketContext.isConnected) {
            setLoading(true);
            setError(null);
            socketContext.send({kind: "get_home_info"});

            setTimeout(() => {
                setLoading(false);
            }, 2000);
        } else {
            setError("Socket non disponible");
        }
    };

    // Traiter les messages reçus via le SocketContext
    useEffect(() => {
        if (socketContext.messages.length > 0) {
            // Parcourir les messages pour trouver les sessions
            for (let i = 0; i < socketContext.messages.length; i++) {
                const message = socketContext.messages[i];

                // Créer un identifiant unique pour ce message
                const messageId = JSON.stringify(message);

                // Vérifier si ce message a déjà été traité
                if (processedMessagesRef.current.has(messageId)) {
                    continue; // Message déjà traité, passer au suivant
                }

                if (message.kind === "home_info" && Array.isArray(message.sessions)) {
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
    }, [socketContext.messages]);

    // Demander les sessions au chargement initial et configurer l'intervalle
    useEffect(() => {
        if (socketContext.isConnected) {
            fetchSessions();
        }
    }, [socketContext.isConnected]);

    // Fonction pour initier le processus de rejoindre une partie publique
    const handleJoinPublicGame = async (roomCode: string) => {
        const parsedRoomCode = parseInt(roomCode, 10);
        try {
            // Vérifier que la salle existe
            const roomExists = await gameContext.checkRoomExists(parsedRoomCode);
            if (roomExists) {
                setTempRoomCode(parsedRoomCode);
                setRoomCodeInput(roomCode);
                setShowUsernameModal(true);
            } else {
                showPopup("error", "Cette partie n'existe pas");
            }
        } catch (err) {
            showPopup("error", err instanceof Error ? err.message : "Erreur lors de la vérification");
        }
    };

    // Handler du submit du modal pour rejoindre une partie existante
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

        const usernameTaken = await gameContext.checkUsernameTaken(username, parsedRoomCode);
        if (usernameTaken) {
            showPopup("error", "Ce pseudo est déjà utilisé");
            return;
        }

        const hasStarted = await gameContext.checkGameHasStarted(parsedRoomCode);
        if (hasStarted) {
            showPopup("error", "Cette partie a déjà commencé");
            setShowUsernameModal(false);
            setTempRoomCode(-1);
            return;
        }

        gameContext.joinGame({
            sessionId: tempRoomCode,
            playerName: username,
        });

        setShowUsernameModal(false);
        setTempRoomCode(-1);

        // Reste connecté et redirige vers la salle d'attente
        navigate("/room");
    };

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
            {error && <div className="w-full p-4 mb-4 bg-red-100 text-red-700 rounded">{error}</div>}

            <div className="flex flex-wrap gap-5 justify-center items-start mt-5 w-full max-md:max-w-full">
                {games.map(game => (
                    <PublicGameCard {...game} onJoin={() => handleJoinPublicGame(game.gameCode)} />
                ))}
            </div>

            {/* Modal pour renseigner le pseudo lors du join */}
            <UsernameModal onSubmit={handleUsernameSubmit} shouldOpen={showUsernameModal} />
        </section>
    );
};

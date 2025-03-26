// server.ts
import { WebSocketServer, WebSocket, RawData } from 'ws';
import { createGameSession, addPlayer, getGameSession, removePlayer, endGameSession, GameSession } from './gameSession';

interface ClientContext {
    currentRoomId: string | null; // Si vous utilisez aussi les salles, sinon null
    currentUserName: string | null;
    currentGameSessionId: string | null;
}

// Structure pour associer une game session à ses connexions (par nom d'utilisateur)
const gameSessionConnections: Map<string, Map<string, WebSocket>> = new Map();

const wss = new WebSocketServer({ port: 2025 });
console.log("WebSocket server is running on ws://localhost:2025");

wss.on('connection', (ws: WebSocket) => {
    console.log('New client connected');
    const context: ClientContext = {
        currentRoomId: null,
        currentUserName: null,
        currentGameSessionId: null,
    };

    ws.on('message', (data: RawData) => {
        try {
            const message = JSON.parse(data.toString());
            console.log('Received message:', message);

            // Switch principal qui réparti les différentes requêtes reçus
            switch (message.kind) {
                // Création d'une partie (game session)
                case 'create_game_session': {
                    if (
                        message.timeLimit == null ||
                        message.numberOfArticles == null ||
                        message.maxPlayers == null ||
                        !message.type ||
                        !message.leader
                    ) {
                        ws.send(JSON.stringify({ kind: 'error', message: 'Paramètres manquants pour la création de partie' }));
                        return;
                    }
                    const session: GameSession = createGameSession({
                        timeLimit: message.timeLimit,
                        numberOfArticles: message.numberOfArticles,
                        maxPlayers: message.maxPlayers,
                        type: message.type,
                        leader: message.leader
                    });
                    context.currentGameSessionId = session.id;
                    context.currentUserName = message.leader;
                    // Initialiser la map pour cette session et y ajouter la connexion du leader
                    gameSessionConnections.set(session.id, new Map([[message.leader, ws]]));
                    ws.send(JSON.stringify({ kind: 'game_session_created', session }));
                    console.log(`Game session ${session.id} créée par ${message.leader}`);
                    break;
                }
                // Rejoindre une partie existante
                case 'join_game_session': {
                    if (!message.sessionId || !message.playerName) {
                        ws.send(JSON.stringify({ kind: 'error', message: 'Paramètres manquants pour rejoindre la partie' }));
                        return;
                    }
                    const session = getGameSession(message.sessionId);
                    if (!session) {
                        ws.send(JSON.stringify({ kind: 'error', message: 'Partie non trouvée' }));
                        return;
                    }
                    if (!addPlayer(message.sessionId, message.playerName)) {
                        ws.send(JSON.stringify({ kind: 'error', message: 'Impossible de rejoindre la partie (capacité maximale atteinte)' }));
                        return;
                    }
                    context.currentGameSessionId = message.sessionId;
                    context.currentUserName = message.playerName;
                    // Ajouter la connexion dans la map correspondante
                    if (!gameSessionConnections.has(message.sessionId)) {
                        gameSessionConnections.set(message.sessionId, new Map());
                    }
                    gameSessionConnections.get(message.sessionId)!.set(message.playerName, ws);
                    ws.send(JSON.stringify({ kind: 'game_session_joined', session }));
                    console.log(`${message.playerName} a rejoint la game session ${message.sessionId}`);
                    break;
                }
                // Autres cas de gestion...
                default: {
                    ws.send(JSON.stringify({ kind: 'error', message: 'Type de message inconnu' }));
                }
            }
        } catch (e) {
            console.error('Error processing message:', e);
            ws.send(JSON.stringify({ kind: 'error', message: 'Format de message invalide' }));
        }
    });

    ws.on('close', () => {
        console.log(`Connection closed for user ${context.currentUserName}`);
        if (context.currentGameSessionId && context.currentUserName) {
            const session = getGameSession(context.currentGameSessionId);
            const connections = gameSessionConnections.get(context.currentGameSessionId);
            if (session && connections) {
                if (session.leader === context.currentUserName) {
                    console.log(`Le leader ${context.currentUserName} s'est déconnecté. Clôture de la session ${context.currentGameSessionId}.`);
                    connections.forEach((clientWs) => {
                        if (clientWs.readyState === WebSocket.OPEN) {
                            clientWs.send(JSON.stringify({
                                kind: 'redirect_home',
                                message: 'Le leader a quitté la partie. Retour à l\'accueil.'
                            }));
                            clientWs.close();
                        }
                    });
                    endGameSession(context.currentGameSessionId);
                    gameSessionConnections.delete(context.currentGameSessionId);
                } else {
                    if (removePlayer(context.currentGameSessionId, context.currentUserName)) {
                        console.log(`Le joueur ${context.currentUserName} a été retiré de la session ${context.currentGameSessionId}`);
                        connections.delete(context.currentUserName);
                    }
                }
            }
        }
    });
});

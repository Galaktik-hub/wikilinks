import { WebSocketServer, WebSocket, RawData } from 'ws';
import { createGameSession, addPlayer, getGameSession, removePlayer, endGameSession, GameSession } from './gameSession';
import { Player } from './player';

interface ClientContext {
    currentRoomId: string | null;
    currentUser: Player | null;
    currentGameSessionId: string | null;
}

const gameSessionConnections: Map<string, Map<string, WebSocket>> = new Map();

const wss = new WebSocketServer({ port: 2025 });
console.log("WebSocket server is running on ws://localhost:2025");

wss.on('connection', (ws: WebSocket) => {
    console.log('New client connected');
    const context: ClientContext = {
        currentRoomId: null,
        currentUser: null,
        currentGameSessionId: null,
    };

    ws.on('message', (data: RawData) => {
        try {
            const message = JSON.parse(data.toString());
            console.log('Received message:', message);

            // Main switch to dispatch messages
            switch (message.kind) {
                case 'create_game_session': {
                    if (
                        message.timeLimit == null ||
                        message.numberOfArticles == null ||
                        message.maxPlayers == null ||
                        !message.type ||
                        !message.leaderName
                    ) {
                        ws.send(JSON.stringify({ kind: 'error', message: 'Paramètres manquants pour la création de partie' }));
                        return;
                    }
                    const leader = new Player(message.leaderName, true);
                    const session: GameSession = createGameSession({
                        timeLimit: message.timeLimit,
                        numberOfArticles: message.numberOfArticles,
                        maxPlayers: message.maxPlayers,
                        type: message.type,
                        leader
                    });
                    context.currentGameSessionId = session.id;
                    context.currentUser = leader;
                    gameSessionConnections.set(session.id, new Map([[leader.id, ws]]));
                    ws.send(JSON.stringify({ kind: 'game_session_created', session }));
                    console.log(`Game session ${session.id} créée par ${leader.name}`);
                    break;
                }
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
                    const player = new Player(message.playerName);
                    if (!addPlayer(message.sessionId, player)) {
                        ws.send(JSON.stringify({ kind: 'error', message: 'Impossible de rejoindre la partie (capacité maximale atteinte)' }));
                        return;
                    }
                    context.currentGameSessionId = message.sessionId;
                    context.currentUser = player;
                    if (!gameSessionConnections.has(message.sessionId)) {
                        gameSessionConnections.set(message.sessionId, new Map());
                    }
                    gameSessionConnections.get(message.sessionId)!.set(player.id, ws);
                    ws.send(JSON.stringify({ kind: 'game_session_joined', session }));
                    console.log(`${player.name} a rejoint la game session ${message.sessionId}`);
                    break;
                }
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
        console.log(`Connection closed for user ${context.currentUser?.name}`);
        if (context.currentGameSessionId && context.currentUser) {
            const session = getGameSession(context.currentGameSessionId);
            const connections = gameSessionConnections.get(context.currentGameSessionId);
            if (session && connections) {
                if (session.leader.equals(context.currentUser)) {
                    console.log(`Le leader ${context.currentUser.name} s'est déconnecté. Clôture de la session ${context.currentGameSessionId}.`);
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
                    if (removePlayer(context.currentGameSessionId, context.currentUser)) {
                        console.log(`Le joueur ${context.currentUser.name} a été retiré de la session ${context.currentGameSessionId}`);
                        connections.delete(context.currentUser.id);
                    }
                }
            }
        }
    });
});

import { WebSocketServer, WebSocket, RawData } from 'ws';
import { getGameSession, removePlayer, endGameSession } from './gameSession';
import { handleMessage, ClientContext } from './messageHandler';

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
            handleMessage(ws, message, context, gameSessionConnections);
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

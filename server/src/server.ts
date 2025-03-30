import { WebSocketServer, WebSocket, RawData } from 'ws';
import { GameSessionManager } from './gameSession';
import { handleMessage, ClientContext } from './messageHandler';

const gameSessionConnections: Map<number, Map<string, WebSocket>> = new Map();

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
            // Call handleMessage (it can be asynchronous if needed)
            handleMessage(ws, message, context, gameSessionConnections);
        } catch (e) {
            console.error('Error processing message:', e);
            ws.send(JSON.stringify({ kind: 'error', message: 'Invalid message format' }));
        }
    });

    ws.on('close', () => {
        console.log(`Connection closed for user ${context.currentUser?.name}`);
        if (context.currentGameSessionId && context.currentUser) {
            const session = GameSessionManager.getSession(context.currentGameSessionId);
            const connections = gameSessionConnections.get(context.currentGameSessionId);
            if (session && connections) {
                if (session.leader.equals(context.currentUser)) {
                    console.log(`Leader ${context.currentUser.name} disconnected. Closing session ${context.currentGameSessionId}.`);
                    connections.forEach((clientWs) => {
                        if (clientWs.readyState === WebSocket.OPEN) {
                            clientWs.send(JSON.stringify({
                                kind: 'redirect_home',
                                message: 'Leader left the game. Returning home.'
                            }));
                            clientWs.close();
                        }
                    });
                    GameSessionManager.endSession(context.currentGameSessionId);
                    gameSessionConnections.delete(context.currentGameSessionId);
                } else {
                    if (session.removePlayer(context.currentUser)) {
                        console.log(`Player ${context.currentUser.name} removed from session ${context.currentGameSessionId}`);
                        connections.delete(context.currentUser.id);
                    }
                }
            }
        }
    });
});

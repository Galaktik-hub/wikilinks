import { WebSocket } from 'ws';
import { GameSessionManager } from './gameSession';
import { Player } from './player/player';
import { createRoom, joinRoom, closeRoom, getRoom, removeMember } from "./rooms";

export interface ClientContext {
    currentRoomId: number | null;
    currentUser: Player | null;
    currentGameSessionId: number | null;
}

export async function handleMessage(
    ws: WebSocket,
    message: any,
    context: ClientContext,
    gameSessionConnections: Map<number, Map<string, WebSocket>>
) {
    switch (message.kind) {
        case 'create_game_session': {
            if (
                message.timeLimit == null ||
                message.numberOfArticles == null ||
                message.maxPlayers == null ||
                !message.type ||
                !message.leaderName
            ) {
                ws.send(JSON.stringify({ kind: 'error', message: 'Missing parameters for game session creation' }));
                return;
            }

            const leader = new Player(message.leaderName, true);
            // Create session using GameSessionManager
            const session = GameSessionManager.createSession({
                timeLimit: message.timeLimit,
                numberOfArticles: message.numberOfArticles,
                maxPlayers: message.maxPlayers,
                type: message.type,
                leader,
            });
            context.currentGameSessionId = session.id;
            context.currentUser = leader;
            gameSessionConnections.set(session.id, new Map([[leader.id, ws]]));

            // Create room using session.id
            createRoom(session.id, leader.name, ws);
            context.currentRoomId = session.id;

            console.log(`Game session ${session.id} created by ${leader.name}`);
            break;
        }
        case 'join_game_session': {
            if (!message.sessionId || !message.playerName) {
                ws.send(JSON.stringify({ kind: 'error', message: 'Missing parameters for joining game session' }));
                return;
            }
            const session = GameSessionManager.getSession(message.sessionId);
            if (!session) {
                ws.send(JSON.stringify({ kind: 'error', message: 'Game session not found' }));
                return;
            }
            const player = new Player(message.playerName);
            if (!session.addPlayer(player)) {
                ws.send(JSON.stringify({ kind: 'error', message: 'Unable to join game session (max capacity reached)' }));
                return;
            }
            context.currentGameSessionId = message.sessionId;
            context.currentUser = player;
            if (!gameSessionConnections.has(message.sessionId)) {
                gameSessionConnections.set(message.sessionId, new Map());
            }
            gameSessionConnections.get(message.sessionId)!.set(player.id, ws);

            const room = joinRoom(message.sessionId, message.playerName, ws);
            if (!room) {
                ws.send(JSON.stringify({ kind: 'error', message: 'Room not found' }));
                return;
            }
            context.currentRoomId = room.id;

            console.log(`${player.name} joined game session ${message.sessionId}`);
            break;
        }
        case 'send_message': {
            const { currentRoomId, currentUser } = context;
            if (!currentRoomId || !currentUser) {
                ws.send(JSON.stringify({ kind: 'error', message: 'Not in a room' }));
                return;
            }
            const room = getRoom(currentRoomId);
            if (!room) return;
            let intercepted = false;
            room.bots.forEach((bot) => {
                if (bot.notifyReceivedMessage && bot.notifyReceivedMessage(currentUser.name, message.content)) {
                    intercepted = true;
                }
            });
            if (!intercepted) {
                room.members.forEach((member) => {
                    member.ws.send(
                        JSON.stringify({
                            kind: 'message_received',
                            content: message.content,
                            sender: currentUser.name,
                        })
                    );
                });
            }
            break;
        }
        case 'start_game': {
            const { currentGameSessionId, currentUser } = context;
            if (!currentGameSessionId || !currentUser) {
                ws.send(JSON.stringify({ kind: 'error', message: 'Not in a game session' }));
                return;
            }
            const session = GameSessionManager.getSession(currentGameSessionId);
            if (!session) {
                ws.send(JSON.stringify({ kind: 'error', message: 'Game session not found' }));
                return;
            }
            if (!session.leader.equals(currentUser)) {
                ws.send(JSON.stringify({ kind: 'error', message: 'Only the leader can start the game' }));
                return;
            }
            // Start the game by initializing session articles
            await session.initializeArticles();
            break;
        }
        case 'disconnect': {
            const { currentRoomId, currentUser } = context;
            if (currentRoomId && currentUser) {
                removeMember(currentRoomId, currentUser.name);
            }
            ws.close();
            break;
        }
        case 'close_room': {
            const { currentRoomId, currentUser } = context;
            if (currentRoomId && currentUser) {
                if (!closeRoom(currentRoomId, currentUser.name)) {
                    ws.send(JSON.stringify({ kind: 'error', message: 'Only the creator can close the room' }));
                }
            }
            break;
        }
        default: {
            ws.send(JSON.stringify({ kind: 'error', message: 'Invalid message kind' }));
            ws.close();
        }
    }
}

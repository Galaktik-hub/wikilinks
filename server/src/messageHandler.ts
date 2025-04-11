import { WebSocket } from "ws";
import { GameSessionManager } from "./gameSessions";
import { Player } from "./player/player";

export interface ClientContext {
    currentRoomId: number | null;
    currentUser: Player | null;
    currentGameSessionId: number | null;
}

export async function handleMessage(ws: WebSocket, message: any, context: ClientContext) {
    switch (message.kind) {
        case "create_game_session": {
            if (
                message.timeLimit == null ||
                message.numberOfArticles == null ||
                message.maxPlayers == null ||
                !message.type ||
                !message.leaderName
            ) {
                ws.send(JSON.stringify({
                    kind: "error",
                    message: "Missing parameters for game session creation",
                }));
                return;
            }

            const leader = new Player(message.leaderName, true);
            const session = GameSessionManager.createSession({
                timeLimit: message.timeLimit,
                numberOfArticles: message.numberOfArticles,
                maxPlayers: message.maxPlayers,
                type: message.type,
                leader,
                ws
            });
            context.currentGameSessionId = session.id;
            context.currentRoomId = session.id;
            context.currentUser = leader;

            console.log(`Session ${session.id} created by ${leader.name}`);
            session.refreshPlayers();
            ws.send(JSON.stringify({
                kind: "game_session_created",
                sessionId: session.id,
                leaderName: session.leader.name,
            }));
            break;
        }
        case "join_game_session": {
            if (!message.sessionId || !message.playerName) {
                ws.send(JSON.stringify({
                    kind: "error",
                    message: "Missing parameters for joining game session",
                }));
                return;
            }
            const session = GameSessionManager.getSession(message.sessionId);
            if (!session) {
                ws.send(JSON.stringify({
                    kind: "error",
                    message: "Game session not found",
                }));
                return;
            }
            const player = new Player(message.playerName);
            if (!session.addPlayer(player, ws)) {
                ws.send(JSON.stringify({
                    kind: "error",
                    message: "Unable to join game session (max capacity reached)",
                }));
                return;
            }
            context.currentGameSessionId = message.sessionId;
            context.currentRoomId = message.sessionId;
            context.currentUser = player;

            console.log(`${player.name} joined the session ${message.sessionId}`);
            ws.send(JSON.stringify({
                kind: "game_session_created",
                sessionId: session.id,
                leaderName: session.leader.name,
            }));
            break;
        }
        case "send_message": {
            const { currentRoomId, currentUser } = context;
            if (!currentRoomId || !currentUser) {
                ws.send(JSON.stringify({ kind: "error", message: "Not in a room" }));
                return;
            }
            const session = GameSessionManager.getSession(currentRoomId);
            if (!session) return;
            session.sendMessage(currentUser.name, message.content);
            break;
        }
        case "start_game": {
            const { currentGameSessionId, currentUser } = context;
            if (!currentGameSessionId || !currentUser) {
                ws.send(JSON.stringify({
                    kind: "error",
                    message: "Not in a game session",
                }));
                return;
            }
            const session = GameSessionManager.getSession(currentGameSessionId);
            if (!session) {
                ws.send(JSON.stringify({
                    kind: "error",
                    message: "Game session not found",
                }));
                return;
            }
            if (session.leader.name !== currentUser.name) {
                ws.send(JSON.stringify({
                    kind: "error",
                    message: "Only the leader can start the game",
                }));
                return;
            }
            await session.initializeArticles();
            break;
        }
        case "update_settings": {
            const { currentGameSessionId, currentUser } = context;
            if (!currentGameSessionId || !currentUser) {
                ws.send(JSON.stringify({
                    kind: "error",
                    message: "Not in a game session",
                }));
                return;
            }
            const session = GameSessionManager.getSession(currentGameSessionId);
            if (!session) {
                ws.send(JSON.stringify({
                    kind: "error",
                    message: "Game session not found",
                }));
                return;
            }
            if (session.leader.name !== currentUser.name) {
                ws.send(JSON.stringify({
                    kind: "error",
                    message: "Only the leader can update settings",
                }));
                return;
            }
            const { timeLimit, numberOfArticles, maxPlayers, type } = message;
            if (timeLimit != null) session.timeLimit = timeLimit;
            if (numberOfArticles != null) session.numberOfArticles = numberOfArticles;
            if (maxPlayers != null) session.maxPlayers = maxPlayers;
            if (type != null) session.type = type;

            session.members.forEach(member => {
                if (member.ws.readyState === member.ws.OPEN) {
                    member.ws.send(JSON.stringify({
                        kind: "settings_modified",
                        timeLimit,
                        numberOfArticles,
                        maxPlayers,
                        type,
                    }));
                }
            });
            break;
        }
        case "mute_player": {
            const { currentGameSessionId, currentUser } = context;
            if (!currentGameSessionId || !currentUser) {
                ws.send(JSON.stringify({
                    kind: "error",
                    message: "Not in a game session",
                }));
                return;
            }
            const session = GameSessionManager.getSession(currentGameSessionId);
            if (!session) {
                ws.send(JSON.stringify({
                    kind: "error",
                    message: "Game session not found",
                }));
                return;
            }
            const targetPlayerName = message.playerName;
            const currentMember = session.members.get(currentUser.name);
            if (currentMember.muted.has(targetPlayerName)) {
                currentMember.muted.delete(targetPlayerName);
            } else {
                currentMember.muted.add(targetPlayerName);
            }
            break;
        }
        case "disconnect": {
            const { currentRoomId, currentUser } = context;
            if (currentRoomId && currentUser) {
                const session = GameSessionManager.getSession(currentRoomId);
                if (session) {
                    session.removePlayer(currentUser);
                }
            }
            ws.close();
            break;
        }
        case "close_room": {
            const { currentRoomId, currentUser } = context;
            if (currentRoomId && currentUser) {
                const session = GameSessionManager.getSession(currentRoomId);
                if (session) {
                    if (!session.closeSession(currentUser.name)) {
                        ws.send(JSON.stringify({
                            kind: "error",
                            message: "Only the creator can close the room",
                        }));
                    }
                }
            }
            break;
        }
        case "get_all_sessions": {
            const allSessions = GameSessionManager.getAllPublicSessions();
            console.log(`Number of sessions : ${allSessions.size}`);
            const sessionsArray: any[] = [];
            allSessions.forEach((session, id) => {
                sessionsArray.push({
                    id: id,
                    type: session.type,
                    playerCount: session.members.size,
                    maxPlayers: session.maxPlayers,
                    leaderName: session.leader.name,
                    timeLimit: session.timeLimit,
                    numberOfArticles: session.numberOfArticles,
                });
            });
            ws.send(JSON.stringify({
                kind: "all_sessions",
                sessions: sessionsArray,
            }));
            break;
        }
        default: {
            ws.send(JSON.stringify({ kind: "error", message: "Invalid message kind" }));
            ws.close();
        }
    }
}

import {WebSocket} from "ws";
import {GameSessionManager} from "./gameSessions";
import {Player} from "./player/player";
import logger from "./logger";

export interface ClientContext {
    currentRoomId: number | null;
    currentUser: Player | null;
    currentGameSessionId: number | null;
}

/**
 * Checks that the client is in an active session and returns the session.
 * Sends an error message via the socket if this is not the case and returns null.
 */
function getSessionOrError(ws: WebSocket, context: ClientContext): ReturnType<typeof GameSessionManager.getSession> | null {
    const {currentGameSessionId, currentUser} = context;
    if (!currentGameSessionId || !currentUser) {
        ws.send(
            JSON.stringify({
                kind: "error",
                message: "Not in a game session",
            }),
        );
        return null;
    }
    const session = GameSessionManager.getSession(currentGameSessionId);
    if (!session) {
        ws.send(
            JSON.stringify({
                kind: "error",
                message: "Game session not found",
            }),
        );
        return null;
    }
    return session;
}

export async function handleMessage(ws: WebSocket, message: any, context: ClientContext) {
    switch (message.kind) {
        case "create_game_session": {
            if (message.timeLimit == null || message.numberOfArticles == null || message.maxPlayers == null || !message.type || !message.leaderName) {
                ws.send(
                    JSON.stringify({
                        kind: "error",
                        message: "Missing parameters for game session creation",
                    }),
                );
                return;
            }

            const leader = new Player(message.leaderName, ws, "creator", true);
            const session = GameSessionManager.createSession({
                timeLimit: message.timeLimit,
                numberOfArticles: message.numberOfArticles,
                maxPlayers: message.maxPlayers,
                type: message.type,
                leader,
                ws,
            });
            context.currentGameSessionId = session.id;
            context.currentRoomId = session.id;
            context.currentUser = leader;

            logger.info(`Session ${session.id} created by "${leader.name}"`);
            session.refreshPlayers();
            ws.send(
                JSON.stringify({
                    kind: "game_session_created",
                    sessionId: session.id,
                    leaderName: session.leader.name,
                    username: leader.name,
                }),
            );
            break;
        }
        case "join_game_session": {
            if (!message.sessionId || !message.playerName) {
                ws.send(
                    JSON.stringify({
                        kind: "error",
                        message: "Missing parameters for joining game session",
                    }),
                );
                return;
            }
            const session = GameSessionManager.getSession(message.sessionId);
            if (!session) {
                ws.send(
                    JSON.stringify({
                        kind: "error",
                        message: "Game session not found",
                    }),
                );
                return;
            }
            if (session.hasStarted) {
                ws.send(
                    JSON.stringify({
                        kind: "error",
                        message: "Game session has already started",
                    }),
                );
                return;
            }
            const player = new Player(message.playerName, ws, "client", false);
            if (!session.addPlayer(player)) {
                ws.send(
                    JSON.stringify({
                        kind: "error",
                        message: "Unable to join game session (max capacity reached)",
                    }),
                );
                return;
            }
            context.currentGameSessionId = message.sessionId;
            context.currentRoomId = message.sessionId;
            context.currentUser = player;

            logger.info(`Player "${player.name}" joined the session ${message.sessionId}`);
            ws.send(
                JSON.stringify({
                    kind: "game_session_created",
                    sessionId: session.id,
                    leaderName: session.leader.name,
                    username: player.name,
                    settings: {
                        timeLimit: session.timeLimit,
                        numberOfArticles: session.numberOfArticles,
                        maxPlayers: session.maxPlayers,
                        type: session.type,
                    },
                }),
            );
            break;
        }
        case "send_message": {
            const session = getSessionOrError(ws, context);
            session.sendMessage(context.currentUser.name, message.content);
            break;
        }
        case "start_game": {
            const session = getSessionOrError(ws, context);
            if (session.leader.name !== context.currentUser.name) {
                ws.send(
                    JSON.stringify({
                        kind: "error",
                        message: "Only the leader can start the game",
                    }),
                );
                return;
            }
            session.members.forEach(member => {
                if (member.ws.readyState === member.ws.OPEN) {
                    member.ws.send(
                        JSON.stringify({
                            kind: "game_launched",
                        }),
                    );
                }
            });
            await session.startGame();
            logger.info(`Game started in session ${session.id}`);
            break;
        }
        case "game_event": {
            const session = getSessionOrError(ws, context);
            session.handleGameEvent(context.currentUser, message.event);
            break;
        }
        case "update_settings": {
            const session = getSessionOrError(ws, context);
            if (session.leader.name !== context.currentUser.name) {
                ws.send(
                    JSON.stringify({
                        kind: "error",
                        message: "Only the leader can update settings",
                    }),
                );
                return;
            }
            const {timeLimit, numberOfArticles, maxPlayers, type} = message;
            if (timeLimit != null) session.timeLimit = timeLimit;
            if (numberOfArticles != null) session.numberOfArticles = numberOfArticles;
            if (maxPlayers != null) session.maxPlayers = maxPlayers;
            if (type != null) session.type = type;

            session.members.forEach(member => {
                if (member.ws.readyState === member.ws.OPEN) {
                    member.ws.send(
                        JSON.stringify({
                            kind: "settings_modified",
                            settings: {
                                timeLimit,
                                numberOfArticles,
                                maxPlayers,
                                type,
                            },
                        }),
                    );
                }
            });
            break;
        }
        case "get_history": {
            const session = getSessionOrError(ws, context);
            ws.send(
                JSON.stringify({
                    kind: "history",
                    history: session.getHistory(),
                }),
            );
            break;
        }
        case "init_inventory": {
            const session = getSessionOrError(ws, context);
            ws.send(
                JSON.stringify({
                    kind: "inventory",
                    inventory: session.initInventory(),
                }),
            );
            break;
        }
        case "mute_player": {
            const session = getSessionOrError(ws, context);
            const targetPlayerName = message.playerName;
            const currentMember = session.members.get(context.currentUser.name);
            if (currentMember.muted.has(targetPlayerName)) {
                currentMember.muted.delete(targetPlayerName);
            } else {
                currentMember.muted.add(targetPlayerName);
            }
            break;
        }
        case "exclude_player": {
            const session = getSessionOrError(ws, context);
            const targetPlayerName = message.playerName;
            const targetMember = session.members.get(targetPlayerName);
            if (targetMember) {
                session.handlePlayerDeparture(targetMember);
            }
            // We simulate the closing of the room for the excluded player
            targetMember.ws.send(
                JSON.stringify({
                    kind: "room_closed",
                }),
            );
            break;
        }
        case "check_room": {
            const roomCodeToCheck = message.roomCode;
            const session = GameSessionManager.getSession(roomCodeToCheck);
            ws.send(
                JSON.stringify({
                    kind: "room_check_result",
                    exists: !!session,
                }),
            );
            break;
        }
        case "check_username": {
            const session = GameSessionManager.getSession(message.roomCode);
            if (!session) {
                ws.send(
                    JSON.stringify({
                        kind: "error",
                        message: "Game session not found",
                    }),
                );
                return;
            }
            const usernameToCheck = message.username;
            const isTaken = session.members.has(usernameToCheck);
            ws.send(
                JSON.stringify({
                    kind: "username_check_result",
                    taken: isTaken,
                }),
            );
            break;
        }
        case "check_game_started": {
            const session = GameSessionManager.getSession(message.roomCode);
            if (!session) {
                ws.send(
                    JSON.stringify({
                        kind: "error",
                        message: "Game session not found",
                    }),
                );
                return;
            }
            ws.send(
                JSON.stringify({
                    kind: "game_started_check_result",
                    started: session.hasStarted,
                }),
            );
            break;
        }
        case "disconnect": {
            const {currentRoomId, currentUser} = context;
            if (currentRoomId && currentUser) {
                const session = GameSessionManager.getSession(currentRoomId);
                if (session) {
                    session.handlePlayerDeparture(currentUser);
                }
            }
            ws.close();
            break;
        }
        case "close_room": {
            const {currentRoomId, currentUser} = context;
            if (currentRoomId && currentUser) {
                const session = GameSessionManager.getSession(currentRoomId);
                if (session) {
                    if (session.leader.name === currentUser.name) {
                        session.handlePlayerDeparture(currentUser);
                    } else {
                        ws.send(
                            JSON.stringify({
                                kind: "error",
                                message: "Only the creator can close the room",
                            }),
                        );
                    }
                }
            }
            break;
        }
        case "get_all_sessions": {
            const allSessions = GameSessionManager.getAllPublicSessions();
            logger.info(`Number of sessions : ${allSessions.size}`);
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
            ws.send(
                JSON.stringify({
                    kind: "all_sessions",
                    sessions: sessionsArray,
                }),
            );
            break;
        }
        default: {
            ws.send(JSON.stringify({kind: "error", message: "Invalid message kind"}));
            ws.close();
        }
    }
}

import {WebSocket} from "ws";
import * as fs from "fs";
import * as path from "path";
import {GameSessionManager, GameType} from "./gameSessions";
import {Player} from "./player/player";
import logger from "./logger";
import {ChallengeSession, ChallengeSessionManager} from "./challenge/challengeManager";
import {checkUsernameUniqueness, registerUsername} from "./utils/challengeUsernameUtils";
import {activePlayers} from "./server";

export interface ClientContext {
    currentRoomId: number | null;
    currentUser: Player | null;
    currentGameSessionId: number | null;
    currentChallengeSessionId: string | null;
}

interface SessionSummary {
    id: number;
    type: GameType;
    playerCount: number;
    maxPlayers: number;
    leaderName: string;
    timeLimit: number;
    numberOfArticles: number;
}

const gamesFile = path.join(__dirname, "games.txt");

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

/**
 * Checks that the file exists, and creates it at ‘0’ if necessary
 */
function ensureGamesFile() {
    if (!fs.existsSync(gamesFile)) {
        try {
            fs.writeFileSync(gamesFile, "0", "utf8");
        } catch (err) {
            logger.error("Unable to create games.txt :", err);
            throw err;
        }
    }
}

/**
 * Increases the number of games played by 1.
 */
function increaseNumberOfGamePlayed() {
    ensureGamesFile();
    fs.readFile(gamesFile, "utf8", (err, data: string) => {
        if (err) {
            logger.error(err);
            return;
        }
        const count = parseInt(data.trim(), 10);
        fs.writeFile(gamesFile, (count + 1).toString(), err => {
            if (err) {
                logger.error(err);
            }
        });
    });
}

/**
 * Gets the number of games played from the file.
 */
function getNumberOfGamePlayed(): number {
    ensureGamesFile();
    const data = fs.readFileSync(gamesFile, "utf8");
    return parseInt(data.trim(), 10);
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
                difficulty: message.difficulty,
                leader,
                ws,
            });
            context.currentGameSessionId = session.id;
            context.currentRoomId = session.id;
            context.currentUser = leader;

            logger.info(`Session ${session.id} created by "${leader.name}"`);

            increaseNumberOfGamePlayed();

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
                        difficulty: session.difficulty,
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
            const {currentGameSessionId, currentChallengeSessionId, currentUser} = context;
            const gameSession = GameSessionManager.getSession(currentGameSessionId);
            if (gameSession) {
                gameSession.handleGameEvent(currentUser.name, message.event);
            }
            const challengeSession = ChallengeSessionManager.getSession(currentChallengeSessionId);
            if (challengeSession) {
                challengeSession.handleEvent(message.event.page_name);
            }
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
            const {timeLimit, numberOfArticles, maxPlayers, type, difficulty} = message;
            if (timeLimit != null) session.timeLimit = timeLimit;
            if (numberOfArticles != null) session.numberOfArticles = numberOfArticles;
            if (maxPlayers != null) session.maxPlayers = maxPlayers;
            if (type != null) session.type = type;
            if (difficulty != null) session.difficulty = difficulty;

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
                                difficulty,
                            },
                        }),
                    );
                }
            });
            break;
        }
        case "get_today_challenge": {
            const article = await ChallengeSession.fetchTodayChallenge();
            ws.send(
                JSON.stringify({
                    kind: "today_challenge",
                    targetArticle: article.targetArticle,
                }),
            );
            break;
        }
        case "get_today_leaderboard": {
            const leaderboard = await ChallengeSession.fetchTodayLeaderboard();
            ws.send(
                JSON.stringify({
                    kind: "today_leaderboard",
                    leaderboard: leaderboard,
                }),
            );
            break;
        }
        case "check_username_challenge": {
            const usernameToCheck = message.usernameToCheck;
            const available = await checkUsernameUniqueness(usernameToCheck);
            ws.send(
                JSON.stringify({
                    kind: "check_username_response",
                    available: available,
                }),
            );
            break;
        }
        case "register_username_challenge": {
            const {usernameToRegister, removeOld, oldUsername} = message;
            const success = await registerUsername(usernameToRegister, removeOld, oldUsername);
            ws.send(
                JSON.stringify({
                    kind: "register_username_response",
                    success: success,
                }),
            );
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
                session.handlePlayerDeparture(targetMember.name);
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
        case "create_challenge_session": {
            const player = new Player(message.username, ws, "creator", true);
            context.currentUser = player;
            const challenge = ChallengeSessionManager.createSession(player, message.startArticle);
            context.currentChallengeSessionId = challenge.id;
            ws.send(
                JSON.stringify({
                    kind: "challenge_session_created",
                    id: challenge.id,
                }),
            );
            break;
        }
        case "start_challenge": {
            const {currentChallengeSessionId, currentUser} = context;
            if (!currentChallengeSessionId || !currentUser) {
                ws.send(
                    JSON.stringify({
                        kind: "error",
                        message: "Not in a challenge session",
                    }),
                );
                return;
            }
            const session = ChallengeSessionManager.getSession(currentChallengeSessionId);
            increaseNumberOfGamePlayed();
            if (!session) {
                ws.send(
                    JSON.stringify({
                        kind: "error",
                        message: "Challenge session not found",
                    }),
                );
                return;
            }
            await session.start();
            break;
        }
        case "time_over": {
            const session = getSessionOrError(ws, context);
            if (!session) return;

            // To avoid sending multiple time the end game message
            if (session.leader.name !== context.currentUser.name) {
                ws.send(
                    JSON.stringify({
                        kind: "error",
                        message: "Only the leader can end the game",
                    }),
                );
                return;
            }

            session.endGame();
            break;
        }
        case "disconnect": {
            const {currentRoomId, currentChallengeSessionId, currentUser} = context;
            if (currentRoomId && currentUser) {
                const session = GameSessionManager.getSession(currentRoomId);
                if (session) {
                    session.handlePlayerDeparture(currentUser.name);
                }
            }
            if (currentChallengeSessionId && currentUser) {
                ChallengeSessionManager.endSession(currentChallengeSessionId);
                ws.send(
                    JSON.stringify({
                        kind: "challenge_ended",
                    }),
                );
            }
            ws.send(
                JSON.stringify({
                    kind: "disconnected",
                }),
            );
            break;
        }
        case "close_room": {
            const {currentRoomId, currentUser} = context;
            if (currentRoomId && currentUser) {
                const session = GameSessionManager.getSession(currentRoomId);
                if (session) {
                    if (session.leader.name === currentUser.name) {
                        session.handlePlayerDeparture(currentUser.name);
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
        case "get_home_info": {
            const allSessions = GameSessionManager.getAllPublicSessions();
            logger.info(`Number of sessions : ${allSessions.size}`);
            const sessionsArray: SessionSummary[] = [];
            const article = await ChallengeSession.fetchTodayChallenge();
            const challengeCount = await ChallengeSession.fetchNumberPlayerTodayChallenge();
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
                    kind: "home_info",
                    sessions: sessionsArray,
                    challengeArticle: article.targetArticle,
                    challengeCount: challengeCount,
                    bannerInfo: {
                        activeGames: GameSessionManager.getAllSessions().size + ChallengeSessionManager.getAllSessions().size,
                        activePlayers: activePlayers,
                        gamesPlayed: getNumberOfGamePlayed(),
                    },
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

import { randomInt } from "node:crypto";
import { Player } from "./player/player";

export type GameType = 'public' | 'private';

export interface GameSession {
    id: string;              // Unique id between 100000 and 999999
    timeLimit: number;       // Time in minutes
    numberOfArticles: number;
    maxPlayers: number;
    type: GameType;
    leader: Player;
    players: Set<Player>;
}

const gameSessions: Map<string, GameSession> = new Map();

/**
 * Creates a new {@link GameSession} with the given parameters.
 * Generates a unique id for the game.
 */
export function createGameSession(params: {
    timeLimit: number,
    numberOfArticles: number,
    maxPlayers: number,
    type: GameType,
    leader: Player
}): GameSession {
    let id: string;
    do {
        id = randomInt(100000, 1000000).toString();
    } while (gameSessions.has(id));

    const session: GameSession = {
        id,
        timeLimit: params.timeLimit,
        numberOfArticles: params.numberOfArticles,
        maxPlayers: params.maxPlayers,
        type: params.type,
        leader: params.leader,
        players: new Set([params.leader])
    };

    gameSessions.set(id, session);
    return session;
}

/**
 * Adds a player to a game, if the capacity is not reached
 * Returns true if success, else false
 */
export function addPlayer(sessionId: string, player: Player): boolean {
    const session = gameSessions.get(sessionId);
    if (!session) return false;
    if (session.players.size >= session.maxPlayers) return false;
    session.players.add(player);
    return true;
}

/**
 * Removes a player from the game.
 */
export function removePlayer(sessionId: string, player: Player): boolean {
    const session = gameSessions.get(sessionId);
    if (!session) return false;
    if (player.equals(session.leader)) return false;
    return session.players.delete(player);
}

/**
 * To close and delete a game session.
 */
export function endGameSession(sessionId: string): boolean {
    return gameSessions.delete(sessionId);
}

/**
 * To get a game object with its id.
 */
export function getGameSession(sessionId: string): GameSession | undefined {
    return gameSessions.get(sessionId);
}

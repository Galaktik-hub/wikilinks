import {Player} from "../player/player";
import {randomInt} from "node:crypto";
import {GameSession} from "./gameSession";
import {GameSettings} from "./gameSettings";

export class GameSessionManager {
    private static sessions: Map<number, GameSession> = new Map();

    /**
     * Creates a new game session with a unique ID.
     */
    public static createSession(leader: Player, gameSettings: GameSettings): GameSession {
        let id: number;
        do {
            id = randomInt(100000, 1000000);
        } while (this.sessions.has(id));

        const session = new GameSession(
            id,
            leader,
            gameSettings
        );

        this.sessions.set(id, session);
        return session;
    }

    /**
     * Retrieves a game session by its ID.
     */
    public static getSession(sessionId: number): GameSession | undefined {
        return this.sessions.get(sessionId);
    }

    /**
     * Ends and deletes a game session.
     */
    public static endSession(sessionId: number): boolean {
        return this.sessions.delete(sessionId);
    }
}
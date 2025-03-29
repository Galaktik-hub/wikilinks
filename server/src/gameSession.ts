import { randomInt } from "node:crypto";
import { Player } from "./player/player";
import {WikipediaService} from "./WikipediaService";

export type GameType = 'public' | 'private';

export class GameSession {
    public id: string;
    public timeLimit: number;
    public numberOfArticles: number;
    public maxPlayers: number;
    public type: GameType;
    public leader: Player;
    public players: Set<Player>;
    public articles: string[];
    public startArticle: string;

    constructor(
        id: string,
        timeLimit: number,
        numberOfArticles: number,
        maxPlayers: number,
        type: GameType,
        leader: Player
    ) {
        this.id = id;
        this.timeLimit = timeLimit;
        this.numberOfArticles = numberOfArticles;
        this.maxPlayers = maxPlayers;
        this.type = type;
        this.leader = leader;
        this.players = new Set([leader]);
        this.articles = [];
        this.startArticle = "";
    }

    /**
     * Adds a player to the session if capacity is not reached.
     * Returns true on success, false otherwise.
     */
    public addPlayer(player: Player): boolean {
        if (this.players.size >= this.maxPlayers) return false;
        this.players.add(player);
        return true;
    }

    /**
     * Removes a player from the session.
     * The leader cannot be removed.
     */
    public removePlayer(player: Player): boolean {
        if (player.equals(this.leader)) return false;
        return this.players.delete(player);
    }

    /**
     * Initializes the Wikipedia articles for the session.
     * Fetches (numberOfArticles + 1) pages and uses the last one as the start article.
     */
    public async initializeArticles(): Promise<void> {
        const totalCount = this.numberOfArticles + 1;
        const articles = await WikipediaService.fetchRandomPopularWikipediaPages(totalCount, 1000, "20250101", "20250325");
        if (articles.length > 0) {
            this.startArticle = articles.pop()!;
            this.articles = articles;
            console.log(`Session ${this.id} initialized with ${this.articles.length} articles and startArticle: ${this.startArticle}`);
        } else {
            console.error("No articles fetched");
        }
    }
}

export class GameSessionManager {
    private static sessions: Map<string, GameSession> = new Map();

    /**
     * Creates a new game session with a unique ID.
     */
    public static createSession(params: {
        timeLimit: number,
        numberOfArticles: number,
        maxPlayers: number,
        type: GameType,
        leader: Player
    }): GameSession {
        let id: string;
        do {
            id = randomInt(100000, 1000000).toString();
        } while (this.sessions.has(id));

        const session = new GameSession(
            id,
            params.timeLimit,
            params.numberOfArticles,
            params.maxPlayers,
            params.type,
            params.leader
        );

        this.sessions.set(id, session);
        return session;
    }

    /**
     * Retrieves a game session by its ID.
     */
    public static getSession(sessionId: string): GameSession | undefined {
        return this.sessions.get(sessionId);
    }

    /**
     * Ends and deletes a game session.
     */
    public static endSession(sessionId: string): boolean {
        return this.sessions.delete(sessionId);
    }
}

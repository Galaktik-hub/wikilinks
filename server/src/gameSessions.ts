import {randomInt} from "node:crypto";
import {WebSocket} from "ws";
import {Player} from "./player/player";
import {WikipediaService} from "./WikipediaService";
import {Bot, JoinLeaveBot, BOTS} from "./bots";

export type GameType = "public" | "private";

export interface SessionMember {
    ws: WebSocket;
    role: "creator" | "client";
    muted: Set<string>;
}

export class GameSession {
    public id: number;
    public timeLimit: number;
    public numberOfArticles: number;
    public maxPlayers: number;
    public type: GameType;
    public articles: string[];
    public startArticle: string;

    public leader: Player;
    public members: Map<string, SessionMember>;
    public bots: Map<string, Bot>;

    constructor(id: number, timeLimit: number, numberOfArticles: number, maxPlayers: number, type: GameType, leader: Player, ws: WebSocket) {
        this.id = id;
        this.timeLimit = timeLimit;
        this.numberOfArticles = numberOfArticles;
        this.maxPlayers = maxPlayers;
        this.type = type;
        this.articles = [];
        this.startArticle = "";

        this.leader = leader;
        this.members = new Map();
        this.members.set(leader.name, {ws, role: "creator", muted: new Set<string>()});

        this.bots = new Map();
        BOTS.forEach(BotClass => {
            const botInstance = new BotClass(`Bot-${BotClass.name}`, (content: string, destination: string | null) => {
                if (destination) {
                    const member = this.members.get(destination);
                    if (member) {
                        member.ws.send(JSON.stringify({kind: "message_received", content, sender: botInstance.name}));
                    }
                } else {
                    this.members.forEach(member => {
                        member.ws.send(JSON.stringify({kind: "message_received", content, sender: botInstance.name}));
                    });
                }
            });
            this.bots.set(botInstance.name, botInstance);
        });
    }

    /**
     * Add a player into the session if the capacity is not reached.
     * The player is added to the map of members with the role "client".
     */
    public addPlayer(player: Player, ws: WebSocket): boolean {
        if (this.members.size >= this.maxPlayers) return false;
        this.members.set(player.name, {ws, role: "client", muted: new Set<string>()});
        this.bots.forEach(bot => {
            if (bot instanceof JoinLeaveBot) {
                bot.notifyMemberJoin(player.name);
            }
        });
        this.refreshPlayers();
        return true;
    }

    /**
     * Removes the player from the map of members.
     * The leader cannot be removed.
     */
    public removePlayer(player: Player): boolean {
        const member = this.members.get(player.name);
        if (!member || member.role === "creator") return false;
        const removed = this.members.delete(player.name);
        if (removed) {
            this.bots.forEach(bot => {
                if (bot instanceof JoinLeaveBot) {
                    bot.notifyMemberLeave(player.name);
                }
            });
            this.refreshPlayers();
        }
        return removed;
    }

    /**
     * Updated the players list and notify all clients.
     */
    public refreshPlayers(): void {
        const playersArray = Array.from(this.members.entries()).map(([username, {role}]) => ({
            username,
            role,
        }));
        this.members.forEach(member => {
            if (member.ws.readyState === member.ws.OPEN) {
                member.ws.send(JSON.stringify({kind: "players_update", players: playersArray}));
            }
        });
    }

    /**
     * Dispatches a message to all members or to a specific member if destination is specified.
     * Doesn't send the message if the members was muted.
     */
    public sendMessage(sender: string, content: string, destination: string | null = null): void {
        let intercepted = false;
        this.bots.forEach(bot => {
            if (bot.notifyReceivedMessage && bot.notifyReceivedMessage(sender, content)) {
                intercepted = true;
            }
        });
        if (!intercepted) {
            if (destination) {
                const member = this.members.get(destination);
                if (member && !member.muted.has(sender)) {
                    member.ws.send(JSON.stringify({kind: "message_received", content, sender}));
                }
            } else {
                this.members.forEach(member => {
                    if (member.ws.readyState === WebSocket.OPEN && !member.muted.has(sender)) {
                        member.ws.send(JSON.stringify({kind: "message_received", content, sender}));
                    }
                });
            }
        }
    }

    /**
     * Initialize the Wikipedia articles for the session.
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
            console.error("No articles found");
        }
    }

    /**
     * Closes the session and notifies all members.
     * Only the leader can close the session.
     */
    public closeSession(requestorName: string): boolean {
        const requester = this.members.get(requestorName);
        if (!requester || requester.role !== "creator") return false;
        this.members.forEach(member => {
            member.ws.send(JSON.stringify({kind: "room_closed", message: "The room was closed by the leader"}));
            member.ws.close();
        });
        return true;
    }
}

export class GameSessionManager {
    private static sessions: Map<number, GameSession> = new Map();

    /**
     * Creates a new game session with a unique ID.
     */
    public static createSession(params: {
        timeLimit: number;
        numberOfArticles: number;
        maxPlayers: number;
        type: GameType;
        leader: Player;
        ws: WebSocket;
    }): GameSession {
        let id: number;
        do {
            id = randomInt(100000, 1000000);
        } while (this.sessions.has(id));

        const session = new GameSession(id, params.timeLimit, params.numberOfArticles, params.maxPlayers, params.type, params.leader, params.ws);

        this.sessions.set(id, session);
        return session;
    }

    /**
     * Fetches the session by its ID.
     */
    public static getSession(sessionId: number): GameSession | undefined {
        return this.sessions.get(sessionId);
    }

    /**
     * Ends and removes a game session.
     */
    public static endSession(sessionId: number): boolean {
        return this.sessions.delete(sessionId);
    }

    /**
     * Returns all active sessions.
     */
    public static getAllSessions(): Map<number, GameSession> {
        return this.sessions;
    }

    /**
     * Returns all public active sessions.
     */
    public static getAllPublicSessions(): Map<number, GameSession> {
        const publicSessions = new Map<number, GameSession>();
        this.sessions.forEach((session, id) => {
            if (session.type === "public") {
                publicSessions.set(id, session);
            }
        });
        return publicSessions;
    }
}

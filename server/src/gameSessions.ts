import {randomInt} from "node:crypto";
import {WebSocket} from "ws";
import {Player} from "./player/player";
import {WikipediaServices} from "./WikipediaService";
import {Bot, JoinLeaveBot, BOTS} from "./bots";
import logger from "./logger";

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
    public hasStarted: boolean;
    public scoreboard: Map<number, string[]>;

    public leader: Player;
    public members: Map<string, Player>;
    public bots: Map<string, Bot>;

    constructor(id: number, timeLimit: number, numberOfArticles: number, maxPlayers: number, type: GameType, leader: Player) {
        this.id = id;
        this.timeLimit = timeLimit;
        this.numberOfArticles = numberOfArticles;
        this.maxPlayers = maxPlayers;
        this.type = type;
        this.articles = [];
        this.startArticle = "";
        this.hasStarted = false;

        this.leader = leader;
        this.members = new Map();
        this.members.set(leader.name, leader);

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
     * Adds a player into the session if the capacity is not reached.
     * The player is added with the role "client".
     */
    public addPlayer(player: Player): boolean {
        if (this.members.size >= this.maxPlayers) return false;
        this.members.set(player.name, player);
        this.bots.forEach(bot => {
            if (bot instanceof JoinLeaveBot) {
                bot.notifyMemberJoin(player.name);
            }
        });
        this.refreshPlayers();
        return true;
    }

    /**
     * Removes the player from the session if they are not the leader.
     * Returns true if the player was removed.
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
     * Refreshes the list of players and notifies all clients.
     */
    public refreshPlayers(): void {
        const playersArray = Array.from(this.members.values()).map(player => ({
            username: player.name,
            role: player.role,
        }));
        this.members.forEach(player => {
            if (player.ws.readyState === WebSocket.OPEN) {
                player.ws.send(JSON.stringify({kind: "players_update", players: playersArray}));
            }
        });
    }

    /**
     * Dispatches a message to all members or to a specific destination.
     * The message is not sent if the sender has been muted.
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
                const player = this.members.get(destination);
                if (player && !player.muted.has(sender)) {
                    player.ws.send(JSON.stringify({kind: "message_received", content, sender}));
                }
            } else {
                this.members.forEach(player => {
                    if (player.ws.readyState === WebSocket.OPEN && !player.muted.has(sender)) {
                        player.ws.send(JSON.stringify({kind: "message_received", content, sender}));
                    }
                });
            }
        }
    }

    /**
     * Starts the game session.
     * Sets the start article and initializes the articles.
     */
    public async startGame(): Promise<void> {
        await this.initializeArticles();
        this.hasStarted = true;
        this.members.forEach(member => {
            if (member.ws.readyState === member.ws.OPEN) {
                // Reset player variables (If they already played a previous game)
                member.reset();
                member.ws.send(JSON.stringify({kind: "game_started", startArticle: this.startArticle, articles: this.articles}));
            }
        });
    }

    /**
     * Initializes the Wikipedia articles for the session.
     * Fetches (numberOfArticles + 1) pages and sets the last one as the start article.
     */
    public async initializeArticles(): Promise<void> {
        const totalCount = this.numberOfArticles + 1;
        const articles = await WikipediaServices.fetchRandomPopularWikipediaPages(totalCount);
        if (articles.length > 0) {
            this.articles = articles.map(item => item.replace(/\s+/g, "_"));
            this.startArticle = this.articles.pop()!;
            logger.info(
                `Session ${this.id} initialized with ${this.articles.length} articles and startArticle: "${this.startArticle}". List of articles: ${articles.join(", ")}`,
            );
        } else {
            logger.error("No articles found");
        }
    }

    /**
     * Centralized function to handle player departure from the session.
     * If the departing player is the leader, the room closure message is sent to every member and the session is ended.
     * Otherwise, the player is simply removed from the session.
     */
    public handlePlayerDeparture(player: Player): void {
        if (player.name === this.leader.name) {
            this.members.forEach(member => {
                if (member.ws.readyState === member.ws.OPEN) {
                    member.ws.send(JSON.stringify({kind: "room_closed", message: "The room was closed because the leader has left"}));
                }
            });
            GameSessionManager.endSession(this.id);
        } else {
            if (this.removePlayer(player)) {
                logger.info(`Player "${player.name}" has been removed from session ${this.id} by host "${this.leader.name}"`);
            }
        }
    }

    /**
     * Updates the scoreboard with the current score of all players.
     * This function must be called after each game event.
     */
    public updateScoreboard(): void {
        const players = Array.from(this.members.values());

        // Sort the players by score
        players.sort((a, b) => {
            const aFound = a.score.get("found") ?? 0;
            const bFound = b.score.get("found") ?? 0;
            if (bFound !== aFound) {
                return bFound - aFound;
            }
            const aVisited = a.score.get("visited") ?? 0;
            const bVisited = b.score.get("visited") ?? 0;
            return aVisited - bVisited;
        });

        this.scoreboard.clear();

        let currentRank = 1;
        let lastFound = players[0].score.get("found") ?? 0;
        let lastVisited = players[0].score.get("visited") ?? 0;

        this.scoreboard.set(1, [players[0].name]);

        for (let i = 1; i < players.length; i++) {
            const p = players[i];
            const found = p.score.get("found") ?? 0;
            const visited = p.score.get("visited") ?? 0;

            if (found === lastFound && visited === lastVisited) {
                this.scoreboard.get(currentRank)!.push(p.name);
            } else {
                currentRank = i + 1;
                lastFound = found;
                lastVisited = visited;
                this.scoreboard.set(currentRank, [p.name]);
            }
        }

        console.log("Updated scoreboard:", this.scoreboard);
    }

    /**
     * Handles game events (e.g., player actions) and dispatches them to everyone.
     */
    public handleGameEvent(player: Player, data: any): void {
        switch (data.type) {
            case "visitedPage": {
                const article = this.articles.find(article => article === data.page_name);
                logger.info(`Article: "${data.page_name}"`);
                if (article) {
                    const index = this.articles.indexOf(article);
                    if (index !== -1) {
                        player.history.addStep("foundPage", {page_name: data.page_name});
                        player.score.set("found", (player.score.get("found") || 0) + 1);
                        data.type = "foundPage";
                    } else {
                        player.history.addStep("visitedPage", {page_name: data.page_name});
                        player.score.set("visited", (player.score.get("visited") || 0) + 1);
                    }
                }
                break;
            }
            case "foundArtifact":
                player.history.addStep("foundArtifact", {artefact: data.artefact});
                break;
            case "usedArtifact":
                player.history.addStep("usedArtifact", {artefact: data.artefact});
                break;
            default:
                logger.error(`Unknown event type: ${data.type}`);
        }
        this.updateScoreboard();
        this.members.forEach(member => {
            if (member.ws.readyState === WebSocket.OPEN) {
                member.ws.send(
                    JSON.stringify({
                        kind: "game_update",
                        event: {
                            type: data.type,
                            data: {
                                player: player.name,
                                ...data,
                            },
                        },
                    }),
                );
            }
        });
    }

    /**
     * Returns the game history of all players in the session.
     */
    public getHistory(): any[] {
        const history = [];
        this.members.forEach(member => {
            history.push({
                player: member.name,
                history: member.history.getHistory(),
            });
        });
        return history;
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

        const session = new GameSession(id, params.timeLimit, params.numberOfArticles, params.maxPlayers, params.type, params.leader);
        this.sessions.set(id, session);
        return session;
    }

    /**
     * Returns the session by its ID.
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

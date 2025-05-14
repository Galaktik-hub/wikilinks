import {randomInt} from "node:crypto";
import {WebSocket} from "ws";
import {Player} from "./player/player";
import {WikipediaServices} from "./WikipediaService";
import {Bot, JoinLeaveBot, BOTS} from "./bots";
import logger from "./logger";
import {HistoryStep} from "./player/history/playerHistoryProps";

export type GameType = "public" | "private";

export interface SessionMember {
    ws: WebSocket;
    role: "creator" | "client";
    muted: Set<string>;
}

interface PlayerHistory {
    player: string;
    history: HistoryStep[];
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
        this.scoreboard = new Map();

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
        this.scoreboard.clear();

        const players = Array.from(this.members.values());
        players.sort((a, b) => {
            const aFound = a.foundArticles;
            const bFound = b.foundArticles;
            if (bFound !== aFound) {
                return bFound - aFound; // more found articles first
            }
            const aVisited = a.visitedArticles;
            const bVisited = b.visitedArticles;
            return aVisited - bVisited;
        });

        // We rank players, while checking for ties
        let rank = 1;
        let prevFound: number | null = null;
        let prevVisited: number | null = null;
        let group: string[] = [];

        players.forEach((player, index) => {
            const found = player.foundArticles;
            const visited = player.visitedArticles;

            console.log(`Player ${player.name} found ${found} articles and visited ${visited} pages`);

            if (index === 0 || (found === prevFound && visited === prevVisited)) {
                // Same rank as previous player or the first player
                group.push(player.name);
            } else {
                // New rank
                this.scoreboard.set(rank, group);
                rank = index + 1;
                group = [player.name];
            }

            prevFound = found;
            prevVisited = visited;
        });

        if (group.length > 0) {
            this.scoreboard.set(rank, group);
        }

        console.log(`Scoreboard: ${JSON.stringify(Array.from(this.scoreboard.entries()))}`);

        if (players[0]?.foundArticles === this.numberOfArticles) {
            this.endGame();
        }
    }

    /**
     * Handles game events (e.g., player actions) and dispatches them to everyone.
     */
    public handleGameEvent(playerName: string, data: any): void {
        const player = this.members.get(playerName);
        switch (data.type) {
            case "visitedPage": {
                const article = this.articles.find(article => article === data.page_name);
                logger.info(`Article: "${data.page_name}"`);
                if (article) {
                    player.history.addStep("foundPage", {page_name: data.page_name});
                    player.foundArticles++;
                    data.type = "foundPage";
                } else {
                    player.history.addStep("visitedPage", {page_name: data.page_name});
                    player.visitedArticles++;
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
    public getHistory(): PlayerHistory[] {
        const history: PlayerHistory[] = [];
        this.members.forEach(member => {
            history.push({
                player: member.name,
                history: member.history.getHistory(),
            });
        });
        return history;
    }

    /**
     * Sends the game over message to all players, as well as the scoreboard.
     */
    public endGame(): void {
        const results: { rank: number; name: string; score: number }[] = [];

        // We build the scores base on a formula
        this.scoreboard.forEach((names, rank) => {
            names.forEach(name => {
                const player = this.members.get(name);
                if (player) {
                    const score = player.foundArticles * 100 - player.visitedArticles * 5;
                    results.push({ rank, name: player.name, score });
                }
            });
        });

        this.members.forEach(member => {
            if (member.ws.readyState === WebSocket.OPEN) {
                member.ws.send(JSON.stringify({
                    kind: "game_over",
                    scoreboard: results,
                }));
            }
        });

        // Réinitialisation de l’état
        this.hasStarted = false;
        this.articles = [];
        this.startArticle = "";
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

import {randomInt} from "node:crypto";
import {WebSocket} from "ws";
import {Player} from "./player/player";
import {WikipediaServices} from "./WikipediaService";
import {Bot, JoinLeaveBot, BOTS} from "./bots";
import logger from "./logger";
import {HistoryStep} from "../../packages/shared-types/player/history";
import {Artifact, ArtifactName} from "../../packages/shared-types/player/inventory";

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
    public trappedArticles: string[];
    public hasStarted: boolean;
    public scoreboard: Map<number, string[]>;
    public difficulty: number;

    public leader: Player;
    public members: Map<string, Player>;
    public bots: Map<string, Bot>;

    public averagePopularity: number;
    public visitedPages: Map<string, {hasArtifact: boolean; luckPercentage?: number; unluckPercentage?: number}>;

    constructor(id: number, timeLimit: number, numberOfArticles: number, maxPlayers: number, type: GameType, difficulty: number, leader: Player) {
        this.id = id;
        this.timeLimit = timeLimit;
        this.numberOfArticles = numberOfArticles;
        this.maxPlayers = maxPlayers;
        this.type = type;
        this.difficulty = difficulty;
        this.articles = [];
        this.startArticle = "";
        this.trappedArticles = [];
        this.hasStarted = false;
        this.scoreboard = new Map();

        this.leader = leader;
        this.members = new Map();
        this.members.set(leader.name, leader);
        this.averagePopularity = 0;
        this.visitedPages = new Map();

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
    public removePlayer(playerName: string): boolean {
        const member = this.members.get(playerName);
        if (!member || member.role === "creator") return false;
        const removed = this.members.delete(playerName);
        if (removed) {
            this.bots.forEach(bot => {
                if (bot instanceof JoinLeaveBot) {
                    bot.notifyMemberLeave(playerName);
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
                member.startGame(this.startArticle, this.articles);
            }
        });
    }

    /**
     * Initializes the Wikipedia articles for the session.
     * Fetches (numberOfArticles + 1) pages and sets the last one as the start article.
     */
    public async initializeArticles(): Promise<void> {
        const totalCount = this.numberOfArticles + 1;
        const {articles, averagePopularity} = await WikipediaServices.fetchRandomPopularWikipediaPages(totalCount, this.difficulty);
        this.averagePopularity = averagePopularity;
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
    public handlePlayerDeparture(playerName: string): void {
        const player = this.members.get(playerName);
        if (player.name === this.leader.name) {
            this.members.forEach(member => {
                if (member.ws.readyState === member.ws.OPEN) {
                    member.ws.send(JSON.stringify({kind: "room_closed", message: "The room was closed because the leader has left"}));
                }
            });
            GameSessionManager.endSession(this.id);
        } else {
            if (this.removePlayer(playerName)) {
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
            const aFound = a.objectivesVisited.length;
            const bFound = b.objectivesVisited.length;
            if (bFound !== aFound) {
                return bFound - aFound; // more found articles first
            }
            const aVisited = a.articlesVisited.length;
            const bVisited = b.articlesVisited.length;
            return aVisited - bVisited;
        });

        // We rank players, while checking for ties
        let rank = 1;
        let prevFound: number | null = null;
        let prevVisited: number | null = null;
        let group: string[] = [];

        players.forEach((player, index) => {
            const found = player.objectivesVisited.length;
            const visited = player.articlesVisited.length;

            logger.info(`Player ${player.name} found ${found} articles and visited ${visited} pages`);

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

        logger.info(`Scoreboard: ${JSON.stringify(Array.from(this.scoreboard.entries()))}`);

        if (players[0]?.objectivesVisited.length === this.numberOfArticles) {
            this.endGame();
        }
    }

    /**
     * Handles game events (e.g., player actions) and dispatches them to everyone.
     */
    public async handleGameEvent(playerName: string, data: any): Promise<void> {
        const player = this.members.get(playerName);
        let pageInfo: {hasArtifact: boolean; luckPercentage?: number; unluckPercentage?: number} = {hasArtifact: false};

        switch (data.type) {
            case "visitedPage": {
                const article = this.articles.find(article => article === data.page_name);
                logger.info(`Article: "${data.page_name}"`);
                if (article) {
                    if (player.foundPage(article)) {
                        data.type = "foundPage";
                    }
                } else {
                    player.visitPage(data.page_name);
                    pageInfo = await this.determineArtifactPresence(data.page_name);
                    if (pageInfo.hasArtifact) {
                        logger.info(
                            `Page "${data.page_name}" contains an artifact with a ${pageInfo.luckPercentage}% chance of success and a ${pageInfo.unluckPercentage}% chance of failure.`,
                        );
                        player.ws.send(
                            JSON.stringify({
                                kind: "game_artifact",
                                type: "info",
                                data: {
                                    hasArtifact: pageInfo.hasArtifact,
                                    luckPercentage: pageInfo.luckPercentage,
                                },
                            }),
                        );
                    } else {
                        logger.info(`Page "${data.page_name}" does not contain an artifact.`);
                    }
                }
                if (this.trappedArticles.includes(data.page_name)) {
                    player.playArtifactMine(data.page_name);
                }
                break;
            }
            case "foundArtifact":
                player.foundArtifact(data.artefact);
                break;
            case "usedArtifact": {
                const success = await player.useArtifact(data.artefact, data.data);

                if (success && data.artefact === "Mine") {
                    const targetPage = data.data.targetPage;
                    if (typeof targetPage === "string" && !this.articles.includes(targetPage)) {
                        this.trappedArticles.push(targetPage.replace(/\s+/g, "_"));
                    }
                }
                break;
            }
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
                            obj_visited: member.objectivesVisited,
                            obj_to_visit: member.objectivesToVisit,
                        },
                    }),
                );
                member.ws.send(
                    JSON.stringify({
                        kind: "inventory",
                        inventory: this.getInventory(),
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
        const results: {rank: number; name: string; score: number}[] = [];

        // We build the scores base on a formula
        this.scoreboard.forEach((names, rank) => {
            names.forEach(name => {
                const player = this.members.get(name);
                if (player) {
                    const score = player.objectivesVisited.length * 1000 - player.articlesVisited.length * 5;
                    results.push({rank, name: player.name, score});
                }
            });
        });

        this.members.forEach(member => {
            if (member.ws.readyState === WebSocket.OPEN) {
                member.ws.send(
                    JSON.stringify({
                        kind: "game_over",
                        scoreboard: results,
                    }),
                );
            }
        });

        // Réinitialisation de l’état
        this.hasStarted = false;
        this.articles = [];
        this.startArticle = "";
        this.trappedArticles = [];
        this.averagePopularity = 0;
    }

    /**
     * Returns the initialise inventory of all players in the session.
     */
    public initInventory(): {player: string; inventory: Record<ArtifactName, Artifact>}[] {
        const inventory: {player: string; inventory: Record<ArtifactName, Artifact>}[] = [];
        this.members.forEach(member => {
            member.inventory.initInventory();
            inventory.push({
                player: member.name,
                inventory: member.inventory.getInventory(),
            });
        });
        return inventory;
    }

    /**
     * Returns the inventory of all players in the session.
     */
    public getInventory(): {player: string; inventory: Record<ArtifactName, Artifact>}[] {
        const inventory: {player: string; inventory: Record<ArtifactName, Artifact>}[] = [];
        this.members.forEach(member => {
            inventory.push({
                player: member.name,
                inventory: member.inventory.getInventory(),
            });
        });
        return inventory;
    }
    /**
     * Determines whether a page has an artifact.
     * If the page has been visited before, it returns the previous result.
     * If the page is found for the first time, it randomly determines if it has an artifact.
     */
    public async determineArtifactPresence(pageName: string): Promise<{hasArtifact: boolean; luckPercentage?: number; unluckPercentage?: number}> {
        if (this.visitedPages.has(pageName)) {
            const pageInfo = this.visitedPages.get(pageName)!;
            return {hasArtifact: pageInfo.hasArtifact, luckPercentage: pageInfo.luckPercentage, unluckPercentage: pageInfo.unluckPercentage};
        }

        const hasArtifact = this.determineArtifactFoundPage();
        if (hasArtifact) {
            const popularity = await WikipediaServices.fetchPagePopularity(pageName);
            const {luckPercentage, unluckPercentage} = this.calculatePercentagesLuck(popularity);
            const pageInfo = {hasArtifact: true, luckPercentage, unluckPercentage};
            this.visitedPages.set(pageName, pageInfo);
            return pageInfo;
        }

        const pageInfo = {hasArtifact: false};
        this.visitedPages.set(pageName, pageInfo);
        return pageInfo;
    }

    /**
     * Determines whether a page found for the first time contains an artifact.
     */
    private determineArtifactFoundPage(): boolean {
        return Math.random() > 0.5;
    }

    /**
     * Calculate the percentages of luck and bad luck for an artifact based on popularity.
     */
    private calculatePercentagesLuck(popularity: number): {luckPercentage: number; unluckPercentage: number} {
        let luckPercentage: number, unluckPercentage: number;

        if (popularity > this.averagePopularity) {
            unluckPercentage = Math.round(Math.random() * 50 + 50);
            luckPercentage = 100 - unluckPercentage;
            logger.info(`Page is popular, luck percentage is lower. (popularity=${popularity})`);
        } else {
            luckPercentage = Math.round(Math.random() * 100);
            unluckPercentage = 100 - luckPercentage;
        }

        return {luckPercentage, unluckPercentage};
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
        difficulty: number;
        leader: Player;
        ws: WebSocket;
    }): GameSession {
        let id: number;
        do {
            id = randomInt(100000, 1000000);
        } while (this.sessions.has(id));

        const session = new GameSession(id, params.timeLimit, params.numberOfArticles, params.maxPlayers, params.type, params.difficulty, params.leader);
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

    public static getNumberActivePlayers(): number {
        let count = 0;
        this.sessions.forEach(session => {
            count += session.members.size;
        });
        return count;
    }
}

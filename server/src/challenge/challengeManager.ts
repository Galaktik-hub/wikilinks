import * as dotenv from "dotenv";
dotenv.config();
import logger from "../logger";
import {Player} from "../player/player";
import ChallengeModel, {ChallengeDocument} from "../models/models";
import {randomUUID} from "node:crypto";

interface Leaderboard {
    name: string;
    history: string[];
    score: number;
    rank: number;
}

/**
 * Manages a single-player Wikipedia challenge: fetching articles,
 * handling page visits and completions, and recording the result in MongoDB.
 */
export class ChallengeSession {
    public id: string;
    private player: Player;
    private startArticle: string = "";
    private targetArticleId: string = "";
    private targetArticle: string = "";
    private startTimestamp: Date;
    private finishTimestamp: Date;

    constructor(player: Player, startArticle: string, id: string) {
        this.player = player;
        this.startArticle = startArticle;
        this.id = id;
    }

    /**
     * Initializes challenge: fetches articles, sets timestamps, and notifies player.
     */
    public async start(): Promise<void> {
        const article = await ChallengeSession.fetchTodayChallenge();
        this.targetArticleId = article._id;
        this.targetArticle = article.targetArticle;

        // Initialize player state
        this.player.reset();
        this.player.articlesVisited.push(this.startArticle);
        this.startTimestamp = new Date();
    }

    public static async fetchTodayChallenge(): Promise<{targetArticle: string; _id: string}> {
        const {start, end} = ChallengeSession.getTodayAndTomorrowDateObject();

        const challenge: ChallengeDocument | null = await ChallengeModel.findOne({
            date: {$gte: start, $lt: end},
        }).exec();

        if (!challenge) {
            throw new Error(`Aucun challenge trouvé entre ${start.toISOString()} et ${end.toISOString()}`);
        }

        return {targetArticle: challenge.targetArticle, _id: challenge._id as string};
    }

    public static async fetchNumberPlayerTodayChallenge(): Promise<number> {
        const {start, end} = ChallengeSession.getTodayAndTomorrowDateObject();

        const challenge = await ChallengeModel.findOne({
            date: {$gte: start, $lt: end},
        }).exec();

        if (!challenge) {
            return 0;
        }

        return challenge.players.length;
    }

    public static async fetchTodayLeaderboard(): Promise<Leaderboard[]> {
        const {start, end} = ChallengeSession.getTodayAndTomorrowDateObject();

        // We sort by score, then by startTimestamp
        const challenge: ChallengeDocument | null = await ChallengeModel.findOne({date: {$gte: start, $lt: end}}).exec();

        if (!challenge) {
            throw new Error(`Aucun challenge trouvé entre ${start.toISOString()} et ${end.toISOString()}`);
        }

        const sortedPlayers = [...challenge.players].sort((a, b) => {
            if (b.score !== a.score) {
                return b.score - a.score;
            }
            return a.startTimestamp.getTime() - b.startTimestamp.getTime();
        });

        return sortedPlayers.map((player, index) => ({
            name: player.name,
            history: player.articles,
            score: player.score,
            rank: index + 1,
        }));
    }

    /**
     * Returns two Date objects: one for today and one for tomorrow.
     * The exact time spawn between the two is 24 hours and both are set to 08:00 UTC.
     */
    public static getTodayAndTomorrowDateObject(): {start: Date; end: Date} {
        const now = new Date();
        const year = now.getUTCFullYear();
        const month = now.getUTCMonth();
        const day = now.getUTCDate();

        // today at 08:00 UTC
        const start = new Date(Date.UTC(year, month, day, 8, 0, 0, 0));

        // If “now” is before 08:00 UTC, roll back one day
        if (now < start) {
            start.setUTCDate(start.getUTCDate() - 1);
        }

        // End is +24 hours
        const end = new Date(start.getTime() + 24 * 60 * 60 * 1000);

        return {start, end};
    }

    /**
     * Handles a page visit or found event.
     */
    public handleEvent(pageName: string): void {
        logger.info(`Player ${this.player.name} visited page "${pageName}" in a challenge.`);
        if (pageName === this.targetArticle) {
            this.player.foundPage(pageName);
            this.finish();
        } else {
            this.player.visitPage(pageName);
        }
    }

    /**
     * Ends the challenge and records the result in MongoDB.
     */
    public async finish(): Promise<void> {
        this.finishTimestamp = new Date();
        // Calculate score based on visited articles and time taken
        const timeTakenInSeconds = Math.floor((this.finishTimestamp.getTime() - this.startTimestamp.getTime()) / 1000);
        let score = 1000 - this.player.articlesVisited.length * 5 - timeTakenInSeconds / 2;

        if (score < 0) {
            score = 0;
        }

        logger.info(`Player ${this.player.name} finished challenge with score ${score}`);

        // Notify player
        this.player.ws.send(
            JSON.stringify({
                kind: "challenge_ended",
                visited: this.player.articlesVisited.length,
                score,
            }),
        );

        // Record in DB
        try {
            // We get the history of the player only if the page is defined
            const history: string[] = this.player.history.getHistory().map(step => {
                if (step.type === "visitedPage" || step.type === "foundPage") {
                    return step.data.page_name;
                } else {
                    return this.startArticle;
                }
            });
            await ChallengeModel.updateOne(
                {_id: this.targetArticleId},
                {
                    $push: {
                        players: {
                            name: this.player.name,
                            startArticle: this.startArticle,
                            startTimestamp: this.startTimestamp,
                            finishTimestamp: this.finishTimestamp,
                            articlesCount: this.player.articlesVisited.length,
                            articles: history,
                            score: score,
                        },
                    },
                },
            );
            logger.info(`Score enregistré pour ${this.player.name}: ${score}`);
        } catch (err: any) {
            logger.error(`Erreur lors de l'enregistrement du score: ${err.message}`);
        }

        ChallengeSessionManager.endSession(this.id);
    }
}

export class ChallengeSessionManager {
    private static sessions: Map<string, ChallengeSession> = new Map();

    /**
     * Creates a new challenge session with a unique UUID.
     */
    public static createSession(player: Player, startArticle: string): ChallengeSession {
        const id = randomUUID();

        const session = new ChallengeSession(player, startArticle, id);
        this.sessions.set(id, session);
        return session;
    }

    /**
     * Returns the session by its ID.
     */
    public static getSession(sessionId: string): ChallengeSession | undefined {
        return this.sessions.get(sessionId);
    }

    /**
     * Ends and removes a game session.
     */
    public static endSession(sessionId: string): boolean {
        return this.sessions.delete(sessionId);
    }

    /**
     * Returns all active sessions.
     */
    public static getAllSessions(): Map<string, ChallengeSession> {
        return this.sessions;
    }
}

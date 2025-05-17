import * as dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import logger from "../logger";
import {Player} from "../player/player";
import ChallengeModel, {ChallengeDocument} from "../models/models";
import {randomUUID} from "node:crypto";

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
        this.targetArticle = await ChallengeSession.fetchTodayChallenge();

        // Initialize player state
        this.player.reset();
        this.player.visitedArticles = 0;
        this.player.foundArticles = 0;
        this.startTimestamp = new Date();
    }

    public static async fetchTodayChallenge(): Promise<string> {
        const {start, end} = ChallengeSession.getTodayAndTomorrowDateObject();

        const challenge: ChallengeDocument | null = await ChallengeModel.findOne({
            date: {$gte: start, $lt: end},
        }).exec();

        if (!challenge) {
            throw new Error(`Aucun challenge trouvé entre ${start.toISOString()} et ${end.toISOString()}`);
        }

        return challenge.targetArticle;
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
        if (pageName === this.targetArticle) {
            this.player.history.addStep("foundPage", {page_name: pageName});
            this.player.foundArticles++;
            this.finish();
        } else {
            this.player.history.addStep("visitedPage", {page_name: pageName});
            this.player.visitedArticles++;
        }
    }

    /**
     * Ends the challenge and records the result in MongoDB.
     */
    public async finish(): Promise<void> {
        this.finishTimestamp = new Date();
        const score = 1000 - this.player.visitedArticles * 5;

        // Notify player
        this.player.ws.send(
            JSON.stringify({
                kind: "challenge_end",
                visited: this.player.visitedArticles,
                score,
            }),
        );

        // Record in DB
        try {
            await ChallengeModel.updateOne({
                _id: this.targetArticleId,
                players: [
                    {
                        name: this.player.name,
                        startArticle: this.startArticle,
                        startTimestamp: this.startTimestamp,
                        finishTimestamp: this.finishTimestamp,
                        articlesCount: this.player.visitedArticles,
                    },
                ],
            });
            logger.info(`Score enregistré pour ${this.player.name}: ${score}`);
        } catch (err: any) {
            logger.error(`Erreur lors de l'enregistrement du score: ${err.message}`);
        }
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

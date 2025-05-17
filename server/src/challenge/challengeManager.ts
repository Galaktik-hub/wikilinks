import mongoose from "mongoose";
import logger from "../logger";
import {Player} from "../player/player";
import {HistoryStep} from "../player/history/playerHistoryProps";
import ChallengeModel, {ChallengeDocument} from "../models/models";

/**
 * Manages a single-player Wikipedia challenge: fetching articles,
 * handling page visits and completions, and recording the result in MongoDB.
 */
export class ChallengeSession {
    private player: Player;
    private startArticle: string = "";
    private startTimestamp: Date;
    private finishTimestamp: Date;
    private onComplete: (history: HistoryStep[]) => void;

    constructor(player: Player, onComplete: (history: HistoryStep[]) => void) {
        this.player = player;
        this.onComplete = onComplete;
    }

    /**
     * Initializes challenge: fetches articles, sets timestamps, and notifies player.
     */
    public async start(): Promise<void> {
        this.startArticle = await this.fetchTodayChallenge();

        // Initialize player state
        this.player.reset();
        this.player.visitedArticles = 0;
        this.player.foundArticles = 0;
        this.startTimestamp = new Date();

        // Notify front
        this.player.ws.send(
            JSON.stringify({
                kind: "challenge_started",
                startArticle: this.startArticle,
            }),
        );
    }

    public async fetchTodayChallenge(): Promise<string> {
        const now = new Date();

        const todayAt8 = new Date(now);
        todayAt8.setHours(8, 0, 0, 0);

        const start = now < todayAt8 ? new Date(todayAt8.getTime() - 24 * 60 * 60 * 1000) : todayAt8;

        const end = new Date(start.getTime() + 24 * 60 * 60 * 1000);

        const challenge: ChallengeDocument | null = await ChallengeModel.findOne({
            date: {$gte: start, $lt: end},
        }).exec();

        if (!challenge) {
            throw new Error(`Aucun challenge trouvé entre ${start.toISOString()} et ${end.toISOString()}`);
        }

        return challenge.targetArticle;
    }

    /**
     * Handles a page visit or found event.
     */
    public handleEvent(type: "visitedPage" | "foundPage", pageName: string): void {
        if (type === "foundPage") {
            this.player.history.addStep("foundPage", {page_name: pageName});
            this.player.foundArticles++;
            this.finish();
        } else {
            this.player.history.addStep("visitedPage", {page_name: pageName});
            this.player.visitedArticles++;
        }

        this.player.ws.send(
            JSON.stringify({
                kind: "update",
                event: {type, pageName, found: this.player.foundArticles, visited: this.player.visitedArticles},
            }),
        );
    }

    /**
     * Ends the challenge and records the result in MongoDB.
     */
    public async finish(): Promise<void> {
        const finishTimestamp = new Date();
        const score = this.player.foundArticles * 100 - this.player.visitedArticles * 5;

        // Notify player
        this.player.ws.send(
            JSON.stringify({
                kind: "challenge_end",
                found: this.player.foundArticles,
                visited: this.player.visitedArticles,
                score,
            }),
        );

        // Record in DB
        try {
            const mongoUri = process.env.MONGODB_URI!;
            await mongoose.connect(mongoUri);
            await ChallengeModel.create({
                date: this.startTimestamp, // date of the challenge
                targetArticle: this.startArticle,
                players: [
                    {
                        name: this.player.name,
                        startArticle: this.startArticle,
                        startTimestamp: this.startTimestamp,
                        finishTimestamp,
                        articlesCount: this.player.foundArticles,
                    },
                ],
            });
            await mongoose.disconnect();
            logger.info(`Score enregistré pour ${this.player.name}: ${score}`);
        } catch (err: any) {
            logger.error(`Erreur lors de l'enregistrement du score: ${err.message}`);
        }

        this.onComplete(this.player.history.getHistory());
    }
}

import * as dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import logger from "../logger";
import {WikipediaServices} from "../WikipediaService";
import ChallengeModel, {ChallengeSchema} from "../models/models";

const mongoUri = process.env.MONGODB_URI;
if (!mongoUri) {
    logger.error("Please define the MONGODB_URI environment variable");
    process.exit(1);
}

ChallengeSchema.index({"players.name": 1});

/**
 * Generates daily challenges, avoiding to reuse the same article in the span of a year.
 * The function will start from the last challenge date + 1 day (time is set to 10:00:00).
 */
async function generateChallenges(n: number) {
    await mongoose.connect(mongoUri, {dbName: "Wikilinks"});
    logger.info(`Connected to ${mongoUri}`);

    // Get last challenge and compute startDate at 10:00
    const lastChallenge = await ChallengeModel.findOne().sort({date: -1}).lean();
    let startDate: Date;
    if (lastChallenge && lastChallenge.date instanceof Date && !isNaN(lastChallenge.date.getTime())) {
        startDate = new Date(lastChallenge.date.getTime() + 24 * 60 * 60 * 1000);
    } else {
        startDate = new Date();
    }
    // Force hours to 10:00:00.000
    startDate.setHours(10, 0, 0, 0);

    // To know if the article has already been used in the last year
    const oneYearAgo = new Date(startDate.getTime() - 365 * 24 * 60 * 60 * 1000);

    for (let i = 0; i < n; i++) {
        // Each challenge date at 10:00:00.000
        const challengeDate = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000);
        challengeDate.setHours(10, 0, 0, 0);

        let article: string | undefined;
        let attempts = 0;

        while (attempts < 10) {
            const [candidate] = await WikipediaServices.fetchRandomPopularWikipediaPages(1);
            if (!candidate) {
                logger.warn(`Aucun article populaire trouvé (tentative ${attempts + 1})`);
                attempts++;
                continue;
            }
            // Checks if the article has already been used in the last year
            const exists = await ChallengeModel.findOne({
                targetArticle: candidate,
                date: {$gte: oneYearAgo},
            }).lean();
            if (exists) {
                logger.info(`Article « ${candidate} » déjà utilisé depuis ${oneYearAgo.toISOString().split("T")[0]}`);
                attempts++;
                continue;
            }
            article = candidate;
            break;
        }

        if (!article) {
            // This error shouldn't happen, if it does, you are very unlucky
            logger.error(`Impossible de trouver un nouvel article pour le challenge du ${challengeDate.toDateString()}`);
            continue;
        }

        const doc = new ChallengeModel({
            date: challengeDate,
            targetArticle: article,
            players: [],
        });

        try {
            await doc.save();
            logger.info(`Created challenge for ${challengeDate.toISOString().split("T")[0]} -> "${article}"`);
        } catch (err: any) {
            logger.error(`Error while creating challenge ${challengeDate}: ${err.message}`);
        }
    }

    await mongoose.disconnect();
    logger.info("Disconnected from MongoDB");
}

// Reading the argument from the command line
const arg = process.argv[2];
if (!arg || isNaN(Number(arg))) {
    logger.error("Usage : ts-node src/index.ts <number_of_challenges>");
    process.exit(1);
}

generateChallenges(Number(arg)).catch(err => {
    logger.error("Unexpected error :", err);
    process.exit(1);
});

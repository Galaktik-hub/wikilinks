// src/index.ts
import * as dotenv from "dotenv";
dotenv.config();
import mongoose, {Schema, Document, model} from "mongoose";
import logger from "../logger";
import {WikipediaServices} from "../WikipediaService";

const mongoUri = process.env.MONGODB_URI;
if (!mongoUri) {
    logger.error("Please define the MONGODB_URI environment variable");
    process.exit(1);
}

interface Player {
    name: string;
    startArticle: string;
    startTimestamp: Date;
    finishTimestamp?: Date;
    articlesCount: number;
}

interface ChallengeDocument extends Document {
    date: Date;
    targetArticle: string;
    players: Player[];
}

const PlayerSchema = new Schema<Player>(
    {
        name: {type: String, required: true, unique: true},
        startArticle: {type: String, required: true},
        startTimestamp: {type: Date, required: true},
        finishTimestamp: {type: Date},
        articlesCount: {type: Number, default: 0},
    },
    {_id: false},
);

const ChallengeSchema = new Schema<ChallengeDocument>(
    {
        date: {type: Date, required: true, unique: true},
        targetArticle: {type: String, required: true},
        players: {type: [PlayerSchema], default: []},
    },
    {
        timestamps: true, // createdAt / updatedAt created automatically
    },
);

const Challenge = model<ChallengeDocument>("challenges", ChallengeSchema);

/**
 * Generates daily challenges, avoiding to reuse the same article in the span of a year.
 * The function will start from the last challenge date + 1 day.
 */
async function generateChallenges(n: number) {
    await mongoose.connect(mongoUri, {dbName: "Wikilinks"});
    logger.info(`Connected to ${mongoUri}`);

    const lastChallenge = await Challenge.findOne().sort({date: -1}).lean();
    let startDate: Date;
    if (lastChallenge && lastChallenge.date instanceof Date && !isNaN(lastChallenge.date.getTime())) {
        startDate = new Date(lastChallenge.date.getTime() + 24 * 60 * 60 * 1000);
    } else {
        startDate = new Date();
    }

    // To know if the article has already been used in the last year
    const oneYearAgo = new Date(startDate.getTime() - 365 * 24 * 60 * 60 * 1000);

    for (let i = 0; i < n; i++) {
        const challengeDate = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000);
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
            const exists = await Challenge.findOne({
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

        const doc = new Challenge({
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

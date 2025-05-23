import {Document, model, Schema} from "mongoose";

interface Player {
    name: string;
    startArticle: string;
    startTimestamp: Date;
    finishTimestamp?: Date;
    articlesCount: number;
    articles: string[];
    score: number;
}

export interface ChallengeDocument extends Document {
    date: Date;
    targetArticle: string;
    players: Player[];
}

export const PlayerSchema = new Schema<Player>(
    {
        name: {type: String, required: true},
        startArticle: {type: String, required: true},
        startTimestamp: {type: Date, required: true},
        finishTimestamp: {type: Date},
        articlesCount: {type: Number, default: 0},
        articles: {type: [String], default: []},
        score: {type: Number, default: 0},
    },
    {_id: false},
);

export const ChallengeSchema = new Schema<ChallengeDocument>(
    {
        date: {type: Date, required: true, unique: true},
        targetArticle: {type: String, required: true},
        players: {type: [PlayerSchema], default: []},
    },
    {
        timestamps: true, // createdAt / updatedAt created automatically
    },
);

const ChallengeModel = model<ChallengeDocument>("challenges", ChallengeSchema);
export default ChallengeModel;

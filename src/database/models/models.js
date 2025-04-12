import mongoose from "mongoose";

const PlayerSchema = new mongoose.Schema({
    start_timestamp: {type: Date, required: true},
    finish_timestamp: {type: Date, required: true},
    name: {type: String, required: true},
    points: {type: Number, required: true},
    start_article: {type: String, required: true},
    visited_articles: [{type: String}],
});

const ChallengeSchema = new mongoose.Schema({
    challenge_date: {type: Date, required: true},
    goal_article: {type: String, required: true},
    players: [PlayerSchema],
});

const ArtifactSchema = new mongoose.Schema({
    name: {type: String, required: true},
    definition: {type: String, required: true},
    positive: {type: Boolean, required: true},
    stackable: {type: Boolean, required: true},
});

export const Challenge = mongoose.model("Challenge", ChallengeSchema, "Challenges");
export const Artifact = mongoose.model("Artifact", ArtifactSchema, "Artifacts");

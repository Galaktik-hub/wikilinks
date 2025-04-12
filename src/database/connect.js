import mongoose from "mongoose";
import {database_url_connect} from "./credentials.js";
import {Artifact, Challenge} from "./models/models.js";

async function run() {
    await mongoose.connect(database_url_connect, {
        dbName: "Wikilinks",
    });

    console.log("Connecté à Wikilinks.");

    const challengeDocument = new Challenge({
        challenge_date: new Date("2023-04-08"),
        goal_article: "Article Objectif",
        players: [
            {
                start_timestamp: new Date("2023-04-08T10:00:00Z"),
                finish_timestamp: new Date("2023-04-08T10:30:00Z"),
                name: "Joueur 1",
                points: 100,
                start_article: "Article de départ",
                visited_articles: ["Article A", "Article B", "Article C"],
            },
            {
                start_timestamp: new Date("2023-04-08T11:00:00Z"),
                finish_timestamp: new Date("2023-04-08T11:45:00Z"),
                name: "Joueur 2",
                points: 80,
                start_article: "Article de départ",
                visited_articles: ["Article D", "Article E"],
            },
        ],
    });

    const artifactDefinitions = {
        GPS: {
            definition: "Indique la distance en nombre de sauts vers l'article courant et les pages objectifs avec le lien optimal.",
            immediate: false,
            positive: true,
        },
        Retour: {
            definition: "Permet de revenir à l'article précédent.",
            immediate: false,
            positive: true,
        },
        Mine: {
            definition:
                "Piège un article (sauf une page objectif) et fait reculer un adversaire de 5 articles s’il tombe dans l’explosion. Choisissez votre article cible.",
            immediate: false,
            positive: true,
        },
        Teleporteur: {
            definition: "Permet au joueur de se téléporter vers un article situé à distance 2 d’une page objectif.",
            immediate: true,
            positive: true,
        },
        Escargot: {
            definition: "Vous êtes condamné à rester au moins 1 minute sur cet article.",
            immediate: true,
            positive: false,
        },
        Gomme: {
            definition: "Vous venez de gommer le dernier objectif atteint, nécessitant de s’y rendre de nouveau.",
            immediate: true,
            positive: false,
        },
        Desorienteur: {
            definition: "Vous envoie aléatoirement vers n’importe quel article de Wikipédia. Bon voyage...",
            immediate: true,
            positive: false,
        },
        Dictateur: {
            definition: "Vous devez vous rendre impérativement vers {page_objectif} avant les prochains objectifs, ou il ne seront pas comptabilisés.",
            immediate: true,
            positive: false,
        },
    };

    const artifactsToInsert = Object.entries(artifactDefinitions).map(([name, data]) => ({
        name,
        definition: data.definition,
        positive: data.positive,
        stackable: !data.immediate,
    }));

    try {
        await challengeDocument.save();
        console.log("Challenge inséré avec succès !");

        await Artifact.insertMany(artifactsToInsert);
        console.log("Artifacts insérés avec succès !");
    } catch (err) {
        console.error("Erreur lors de l'insertion du challenge :", err);
    } finally {
        await mongoose.connection.close();
    }
}

run();

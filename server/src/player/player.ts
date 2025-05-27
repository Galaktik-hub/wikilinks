import {randomUUID} from "node:crypto";
import {WebSocket} from "ws";
import {PlayerHistory} from "./history/playerHistory";
import {Inventory} from "./inventory/inventory";
import {ArtifactName} from "../../../packages/shared-types/player/inventory";
import {WikipediaServices} from "../WikipediaService";
import {getIdFromTitle} from "../utils/wikipediaArticleUtils";
import {execFile} from "node:child_process";
import * as fs from "fs";
import * as path from "path";
import logger from "../logger";

export type PlayerRole = "creator" | "client";

export class Player {
    id: string;
    name: string;
    ws: WebSocket;
    role: PlayerRole;
    muted: Set<string>;
    isLeader: boolean;
    inventory: Inventory;
    history: PlayerHistory;

    // articles
    objectivesVisited: string[];
    objectivesToVisit: string[];
    articlesVisited: string[];
    priorityObjective: string | null;

    constructor(name: string, ws: WebSocket, role: PlayerRole = "client", isLeader: boolean = false) {
        this.id = randomUUID();
        this.name = name;
        this.ws = ws;
        this.role = role;
        this.muted = new Set<string>();

        this.isLeader = isLeader;
        this.inventory = new Inventory();
        this.history = new PlayerHistory();

        this.objectivesVisited = [];
        this.objectivesToVisit = [];
        this.articlesVisited = [];
        this.priorityObjective = null;
    }

    startGame(startArticle: string, articles: string[]): void {
        // Reset player variables (If they already played a previous game)
        this.reset();
        this.objectivesToVisit = articles;
        this.articlesVisited.push(startArticle);
        this.history.addStep("start", {page_name: startArticle});
        this.ws.send(JSON.stringify({kind: "game_started", startArticle: startArticle, articles: articles}));
    }

    equals(other: Player): boolean {
        return this.id === other.id;
    }

    valueOf(): string {
        return this.id;
    }

    visitPage(page_name: string) {
        this.history.addStep("visitedPage", {page_name: page_name});
        this.articlesVisited.push(page_name);
    }

    foundPage(page_name: string): boolean {
        if (this.priorityObjective && page_name !== this.priorityObjective) {
            this.visitPage(page_name);
            this.ws.send(
                JSON.stringify({
                    kind: "game_artifact",
                    type: "execution",
                    artefact: "Dictateur",
                    data: {
                        targetArticle: this.priorityObjective,
                    },
                }),
            );
            this.history.addStep("artifactEffect", {artefact: "Dictateur", source: page_name});
            return false;
        }
        this.history.addStep("foundPage", {page_name: page_name});
        this.articlesVisited.push(page_name);
        this.objectivesVisited.push(page_name);
        this.objectivesToVisit = this.objectivesToVisit.filter(name => name !== page_name);
        if (this.priorityObjective === page_name) {
            this.priorityObjective = null;
        }
        return true;
    }

    foundArtifact(name: ArtifactName, quantity: number = 1) {
        this.inventory.addArtifact(name, quantity);
        this.history.addStep("foundArtifact", {artefact: name});
    }

    removeArtifact(name: ArtifactName, quantity: number = 1) {
        this.inventory.removeArtifact(name, quantity);
    }

    async useArtifact(name: ArtifactName, data?: Record<string, string>): Promise<boolean> {
        const result = this.inventory.useArtifact(name);
        if (result) {
            switch (name) {
                case "GPS":
                    await this.useArtifactGPS(data.currentTitle);
                    break;
                case "Retour": {
                    this.articlesVisited.pop();
                    break;
                }
                case "Mine":
                    // Back side - manage in gameSession to set trappedArticles
                    break;
                case "Teleporteur":
                    // Implemented solver first
                    break;
                case "Escargot":
                    // Front side
                    break;
                case "Gomme":
                    this.useArtifactGomme();
                    break;
                case "Desorienteur":
                    await this.useArtifactDesorienteur();
                    break;
                case "Dictateur":
                    this.useArtifactDictateur();
                    break;
            }
            // Enregistrement de l'action d'utilisation d'un artefact
            this.history.addStep("usedArtifact", {artefact: name});
        }
        return result;
    }

    async useArtifactGPS(currentTitle: string): Promise<boolean> {
        if (this.objectivesToVisit.length === 0) return false;

        const idx = Math.floor(Math.random() * this.objectivesToVisit.length);
        const target = this.objectivesToVisit[idx];

        const solverDir = path.join(__dirname, "../solver");
        const exeName = process.platform === "win32" ? "wikiSolveur.exe" : "wikiSolveur";
        const solverPath = path.join(solverDir, exeName);
        const txtPath = path.join(solverDir, "solver/graph.txt");
        const binPath = txtPath + ".bin";

        if (!fs.existsSync(binPath)) {
            logger.info("Creation of a non-existent graph.txt.bin file");
            await new Promise<void>((resolve, reject) => {
                execFile(solverPath, [txtPath, "0", "0", "0"], err => {
                    if (err) {
                        logger.error("Erreur conversion bin:", err);
                        return reject(err);
                    }
                    resolve();
                });
            });
        }

        const currentId = await getIdFromTitle(currentTitle);
        const targetId = await getIdFromTitle(target);

        return new Promise<boolean>(resolve => {
            logger.info(`GPS artifact invoked: start=${currentId} target=${targetId}`);
            execFile(solverPath, [binPath, "1", String(currentId), String(targetId)], (err, stdout) => {
                if (err) {
                    logger.error("Erreur GPS solver:", err);
                    return resolve(false);
                }
                const lines = stdout
                    .trim()
                    .split(/\r?\n/)
                    .map(l => l.trim())
                    .filter(l => l);
                const pathLine = lines[lines.length - 1];
                const ids = pathLine.split("->").map(s => s.trim());
                const distance = ids.length - 1;
                const nextId = ids[1];

                this.ws.send(
                    JSON.stringify({
                        kind: "game_artifact",
                        type: "execution",
                        artefact: "GPS",
                        data: {distance, nextId},
                    }),
                );
                this.history.addStep("artifactEffect", {artefact: "GPS"});
                resolve(true);
            });
        });
    }

    useArtifactGomme() {
        const last = this.objectivesVisited.pop();
        this.objectivesToVisit.push(last);
        this.history.removeLastObjectiveStep();
    }

    playArtifactMine(page: string) {
        const lastFive = this.articlesVisited.slice(-5);
        lastFive.forEach(article => {
            const idx = this.objectivesVisited.indexOf(article);
            if (idx !== -1) {
                this.objectivesVisited.splice(idx, 1);
                this.objectivesToVisit.push(article);
                this.history.removeLastByType("foundPage");
            }
        });
        this.ws.send(
            JSON.stringify({
                kind: "game_artifact",
                type: "execution",
                artefact: "Mine",
                data: {
                    source: page,
                },
            }),
        );
        this.history.addStep("artifactEffect", {artefact: "Mine", source: page});
    }

    async useArtifactDesorienteur() {
        const {articles: randomArticle} = await WikipediaServices.fetchRandomPopularWikipediaPages(1, 5);
        this.ws.send(
            JSON.stringify({
                kind: "game_artifact",
                type: "execution",
                artefact: "Desorienteur",
                data: {
                    randomArticle: randomArticle[0],
                },
            }),
        );
        this.history.addStep("artifactEffect", {artefact: "Desorienteur", source: randomArticle[0]});
    }

    useArtifactDictateur() {
        if (this.objectivesToVisit.length === 0) return;
        const idx = Math.floor(Math.random() * this.objectivesToVisit.length);
        this.priorityObjective = this.objectivesToVisit[idx];
        this.ws.send(
            JSON.stringify({
                kind: "game_artifact",
                type: "execution",
                artefact: "Dictateur",
                data: {
                    targetArticle: this.priorityObjective,
                },
            }),
        );
    }

    reset() {
        this.objectivesVisited = [];
        this.objectivesToVisit = [];
        this.articlesVisited = [];
        this.history = new PlayerHistory();
        this.inventory = new Inventory();
    }
}

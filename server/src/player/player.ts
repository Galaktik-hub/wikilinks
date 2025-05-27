import {randomUUID} from "node:crypto";
import {WebSocket} from "ws";
import {PlayerHistory} from "./history/playerHistory";
import {Inventory} from "./inventory/inventory";
import {ArtifactName} from "../../../packages/shared-types/player/inventory";
import {WikipediaServices} from "../WikipediaService";
import {getIdFromTitle, getTitleFromId} from "../utils/wikipediaArticleUtils";
import logger from "../logger";
import {solvePath} from "../utils/solverUtils";

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
        this.removeObjective(page_name);
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

    private pickRandomObjective(): string {
        const idx = Math.floor(Math.random() * this.objectivesToVisit.length);
        return this.objectivesToVisit[idx];
    }

    private removeObjective(title: string): void {
        this.objectivesToVisit = this.objectivesToVisit.filter(t => t !== title);
    }

    async useArtifact(name: ArtifactName, data?: Record<string, string>): Promise<boolean> {
        const result = this.inventory.useArtifact(name);
        if (result) {
            // Enregistrement de l'action d'utilisation d'un artefact
            this.history.addStep("usedArtifact", {artefact: name});
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
                    await this.useArtifactTeleporteur(data.currentTitle);
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
        }
        return result;
    }

    async useArtifactGPS(currentTitle: string): Promise<boolean> {
        if (this.objectivesToVisit.length === 0) return false;
        const target = this.pickRandomObjective();
        try {
            const ids = await solvePath(await getIdFromTitle(currentTitle), await getIdFromTitle(target));
            if (ids.length < 2) return false;
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
            return true;
        } catch (err) {
            logger.error("GPS artifact error:", err);
            return false;
        }
    }

    async useArtifactTeleporteur(currentTitle: string): Promise<boolean> {
        if (this.objectivesToVisit.length === 0) return false;
        const target = this.pickRandomObjective();
        try {
            const ids = await solvePath(await getIdFromTitle(currentTitle), await getIdFromTitle(target));
            let teleportedIdx: number;
            if (ids.length >= 4) teleportedIdx = 2;
            else if (ids.length === 3) teleportedIdx = 1;
            else {
                // direct link, retry with new target
                this.removeObjective(target);
                return this.useArtifactTeleporteur(currentTitle);
            }
            const teleportedId = ids[teleportedIdx];
            const teleportedTitle = await getTitleFromId(teleportedId);
            this.ws.send(
                JSON.stringify({
                    kind: "game_artifact",
                    type: "execution",
                    artefact: "Teleporteur",
                    data: {teleportedTitle: teleportedTitle},
                }),
            );
            this.history.addStep("artifactEffect", {artefact: "Teleporteur", source: teleportedTitle});
            return true;
        } catch (err) {
            logger.error("Teleporteur artifact error:", err);
            return false;
        }
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

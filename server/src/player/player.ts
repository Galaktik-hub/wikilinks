import {randomUUID} from "node:crypto";
import {WebSocket} from "ws";
import {PlayerHistory} from "./history/playerHistory";
import {Inventory} from "./inventory/inventory";
import {ArtifactName} from "./inventory/inventoryProps";
import {WikipediaServices} from "../WikipediaService";

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
    objectivesVisited: string[];
    objectivesToVisit: string[];
    articlesVisited: string[];

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

    foundPage(page_name: string) {
        this.history.addStep("foundPage", {page_name: page_name});
        this.articlesVisited.push(page_name);
        this.objectivesVisited.push(page_name);
        this.objectivesToVisit = this.objectivesToVisit.filter(name => name !== page_name);
    }

    foundArtifact(name: ArtifactName, quantity: number = 1) {
        this.inventory.addArtifact(name, quantity);
        this.history.addStep("foundArtifact", {artefact: name});
    }

    removeArtifact(name: ArtifactName, quantity: number = 1) {
        this.inventory.removeArtifact(name, quantity);
    }

    async useArtifact(name: ArtifactName): Promise<boolean> {
        this.inventory.addArtifact("Desorienteur");
        const result = this.inventory.useArtifact(name);
        if (result) {
            switch (name) {
                case "GPS":
                    // Implemented solver first
                    break;
                case "Retour": {
                    this.articlesVisited.pop();
                    break;
                }
                case "Mine":
                    this.useArtifactMine();
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
                    break;
            }
            // Enregistrement de l'action d'utilisation d'un artefact
            this.history.addStep("usedArtifact", {artefact: name});
        }
        return result;
    }

    useArtifactGomme() {
        const last = this.objectivesVisited.pop();
        this.objectivesToVisit.push(last);
        this.history.removeLastObjectiveStep();
    }

    useArtifactMine() {
        // TODO: Set the target article in the gameSession (find a way to do it
        return null;
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
        this.ws.send(JSON.stringify({
            kind: "game_artifact",
            artefact: "Mine",
            data: {
                source: page,
            }
        }))
        this.history.addStep("artifactEffect", {artefact: "Mine", source: page});
    }

    async useArtifactDesorienteur() {
        const randomArticle = await WikipediaServices.fetchRandomPopularWikipediaPages(1, 0);
        this.ws.send(JSON.stringify({
            kind: "game_artifact",
            artefact: "Desorienteur",
            data: {
                randomArticle: randomArticle[0],
            }
        }));
    }

    reset() {
        this.objectivesVisited = [];
        this.objectivesToVisit = [];
        this.articlesVisited = [];
        this.history = new PlayerHistory();
        this.inventory = new Inventory();
    }
}

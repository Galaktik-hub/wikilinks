import {randomUUID} from "node:crypto";
import {WebSocket} from "ws";
import {PlayerHistory} from "./history/playerHistory";
import {Inventory} from "./inventory/inventory";
import {ArtifactName} from "./inventory/inventoryProps";

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
        this.history = new PlayerHistory(this);
        this.objectivesVisited = [];
        this.objectivesToVisit = [];
        this.articlesVisited = [];
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

    useArtifact(name: ArtifactName): boolean {
        const result = this.inventory.useArtifact(name);
        if (result) {
            switch (name) {
                case "GPS":
                    break;
                case "Retour":
                    break;
                case "Mine":
                    break;
                case "Teleporteur":
                    break;
                case "Escargot":
                    break;
                case "Gomme":
                    this.playArtifactGomme();
                    break;
                case "Desorienteur":
                    break;
                case "Dictateur":
                    break;
            }
            // Enregistrement de l'action d'utilisation d'un artefact
            this.history.addStep("usedArtifact", {artefact: name});
        }
        return result;
    }

    playArtifactGomme() {
        const last = this.objectivesVisited.pop();
        this.objectivesToVisit.push(last);
        this.history.removeLastObjectiveStep();
    }

    reset() {
        this.objectivesVisited = [];
        this.objectivesToVisit = [];
        this.articlesVisited = [];
        this.history = new PlayerHistory(this);
        this.inventory = new Inventory();
    }
}

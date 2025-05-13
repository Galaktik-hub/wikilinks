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

    constructor(name: string, ws: WebSocket, role: PlayerRole = "client", isLeader: boolean = false) {
        this.id = randomUUID();
        this.name = name;
        this.ws = ws;
        this.role = role;
        this.muted = new Set<string>();

        this.isLeader = isLeader;
        this.inventory = new Inventory();
        this.history = new PlayerHistory(this);
    }

    equals(other: Player): boolean {
        return this.id === other.id;
    }

    valueOf(): string {
        return this.id;
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
            // Enregistrement de l'action d'utilisation d'un artefact
            this.history.addStep("usedArtifact", {artefact: name});
        }
        return result;
    }
}

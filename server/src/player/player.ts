import {Inventory} from "./Inventory/Inventory";
import {ArtifactName} from "./Inventory/InventoryProps";
import {PlayerHistory} from "./History/PlayerHistory";

export class Player {
    id: string;
    name: string;
    isLeader: boolean;
    inventory: Inventory;
    history: PlayerHistory;

    constructor(name: string, isLeader: boolean = false) {
        this.id = crypto.randomUUID();
        this.name = name;
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

    addArtifact(name: ArtifactName, quantity: number = 1) {
        this.inventory.addArtifact(name, quantity);
        this.history.addStep('foundArtifact', { artefact: name });
    }

    removeArtifact(name: ArtifactName, quantity: number = 1) {
        this.inventory.removeArtifact(name, quantity);
    }

    useArtifact(name: ArtifactName): boolean {
        const result = this.inventory.useArtifact(name);
        if (result) {
            // Enregistrement de l'action d'utilisation d'un artefact
            this.history.addStep('usedArtifact', { artefact: name });
        }
        return result;
    }
}
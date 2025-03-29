import {Inventory} from "./Inventory/Inventory";
import {ArtifactName} from "./Inventory/InventoryProps";

export class Player {
    id: string;
    name: string;
    isLeader: boolean;
    inventory: Inventory;

    constructor(name: string, isLeader: boolean = false) {
        this.id = crypto.randomUUID();
        this.name = name;
        this.isLeader = isLeader;
        this.inventory = new Inventory();
    }

    equals(other: Player): boolean {
        return this.id === other.id;
    }

    valueOf(): string {
        return this.id;
    }

    addArtifact(name: ArtifactName, quantity: number = 1) {
        this.inventory.addArtifact(name, quantity);
    }

    removeArtifact(name: ArtifactName, quantity: number = 1) {
        this.inventory.removeArtifact(name, quantity);
    }

    useArtifact(name: ArtifactName): boolean {
        return this.inventory.useArtifact(name);
    }
}
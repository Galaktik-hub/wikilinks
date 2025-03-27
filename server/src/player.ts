export class Player {
    id: string;
    name: string;
    isLeader: boolean;

    constructor(name: string, isLeader: boolean = false) {
        this.id = crypto.randomUUID();
        this.name = name;
        this.isLeader = isLeader;
    }

    equals(other: Player): boolean {
        return this.id === other.id;
    }

    valueOf(): string {
        return this.id;
    }
}
import {Artifact, artifactDefinitions, ArtifactName, ImmediateArtifact, StackableArtifact} from "./inventoryProps";

export class Inventory {
    private artifacts: Record<ArtifactName, Artifact>;

    constructor() {
        this.artifacts = {} as Record<ArtifactName, Artifact>;
        this.initInventory();
    }

    getInventory(): Record<ArtifactName, Artifact> {
        return this.artifacts;
    }

    initInventory() {
        for (const name in artifactDefinitions) {
            const artifactName = name as ArtifactName;
            const def = artifactDefinitions[artifactName];
            if (def.immediate) {
                this.artifacts[artifactName] = {
                    name: artifactName,
                    definition: def.definition,
                    positive: def.positive,
                    target: def.target,
                    immediate: true,
                    possessed: false,
                };
            } else {
                this.artifacts[artifactName] = {
                    name: artifactName,
                    definition: def.definition,
                    positive: def.positive,
                    target: def.target,
                    immediate: false,
                    count: 3, // Test value, by default use 0
                };
            }
        }
    }

    // Ajoute un artefact, pour les items stackables on ajoute la quantité
    addArtifact(name: ArtifactName, quantity: number = 1) {
        const artifact = this.artifacts[name];
        if (artifact.immediate) {
            (artifact as ImmediateArtifact).possessed = true;
        } else {
            (artifact as StackableArtifact).count += quantity;
        }
    }

    // Retire un artefact, on décrémente la quantité pour un stackable ou on désactive pour un immédiat
    removeArtifact(name: ArtifactName, quantity: number = 1) {
        const artifact = this.artifacts[name];
        if (artifact.immediate) {
            (artifact as ImmediateArtifact).possessed = false;
        } else {
            (artifact as StackableArtifact).count = Math.max(0, (artifact as StackableArtifact).count - quantity);
        }
    }

    // Utilise un artefact (retire 1 du compteur ou le marque comme non possédé)
    useArtifact(name: ArtifactName): boolean {
        const artifact = this.artifacts[name];
        if (artifact.immediate) {
            if ((artifact as ImmediateArtifact).possessed) {
                (artifact as ImmediateArtifact).possessed = false;
                return true;
            }
            return false;
        } else {
            if ((artifact as StackableArtifact).count > 0) {
                (artifact as StackableArtifact).count--;
                return true;
            }
            return false;
        }
    }

    getArtifact(name: ArtifactName): Artifact {
        return this.artifacts[name];
    }
}

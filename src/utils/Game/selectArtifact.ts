import {artifactDefinitions, ArtifactName} from "../../../packages/shared-types/player/inventory";
import {ArtifactInfo} from "../../context/GameContext";

/**
 * Returns the name of the chosen artefact according to luckPercentage.
 */
export function selectArtifact(info: ArtifactInfo): ArtifactName | null {
    const luck = info.luckPercentage ?? 50;
    const roll = Math.random() * 100;
    // Construire le pool selon positif/négatif
    const pool = (Object.entries(artifactDefinitions) as [ArtifactName, any][]).filter(([, def]) => def.positive === roll <= luck).map(([name]) => name);
    if (pool.length === 0) return null;
    const index = Math.floor(Math.random() * pool.length);
    return pool[index];
}

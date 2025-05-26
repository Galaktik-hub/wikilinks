export type ArtifactName = "GPS" | "Retour" | "Mine" | "Teleporteur" | "Escargot" | "Gomme" | "Desorienteur" | "Dictateur";
export type ArtifactTarget = "self" | "player" | "article";

interface BaseArtifact {
    name: ArtifactName;
    definition: string;
    positive: boolean;
    target: ArtifactTarget;
}

export interface StackableArtifact extends BaseArtifact {
    immediate: false;
    count: number;
}

export interface ImmediateArtifact extends BaseArtifact {
    immediate: true;
    possessed: boolean;
}

export type Artifact = StackableArtifact | ImmediateArtifact;

export const artifactDefinitions: Record<ArtifactName, {definition: string; immediate: boolean; positive: boolean; target: ArtifactTarget}> = {
    GPS: {
        definition: "Indique la distance en nombre de sauts vers l'article courant et les pages objectifs avec le lien optimal.",
        immediate: false,
        positive: true,
        target: "self",
    },
    Retour: {
        definition: "Permet de revenir à l'article précédent.",
        immediate: false,
        positive: true,
        target: "self",
    },
    Mine: {
        definition:
            "Piègez un article (sauf une page objectif) et faites reculer un adversaire de 5 articles s’il tombe dans l’explosion. Choisissez votre article cible.",
        immediate: false,
        positive: true,
        target: "article",
    },
    Teleporteur: {
        definition: "Vous téléporte vers un article situé à distance 2 d’une page objectif. Effet immédiat.",
        immediate: true,
        positive: true,
        target: "self",
    },
    Escargot: {
        definition: "Vous êtes condamné à rester au moins 1 minute sur cet article. Effet immédiat.",
        immediate: true,
        positive: false,
        target: "self",
    },
    Gomme: {
        definition: "Vous venez de gommer votre dernier objectif atteint, nécessitant de s’y rendre de nouveau.",
        immediate: true,
        positive: false,
        target: "self",
    },
    Desorienteur: {
        definition: "Vous envoie aléatoirement vers n’importe quel article de Wikipédia. Bon voyage...",
        immediate: true,
        positive: false,
        target: "self",
    },
    Dictateur: {
        definition: "Vous devez vous rendre impérativement vers {page_obj} avant les prochains objectifs.",
        immediate: true,
        positive: false,
        target: "self",
    },
};

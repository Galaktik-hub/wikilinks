export type ArtifactName = "GPS" | "Retour" | "Mine" | "Teleporteur" | "Escargot" | "Gomme" | "Desorienteur" | "Dictateur";

interface BaseArtifact {
    name: ArtifactName;
    definition: string;
    positive: boolean;
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

export const artifactDefinitions: Record<ArtifactName, {definition: string; immediate: boolean; positive: boolean}> = {
    GPS: {
        definition: "Indique la distance en nombre de sauts vers l'article courant et les pages objectifs avec le lien optimal.",
        immediate: false,
        positive: true,
    },
    Retour: {
        definition: "Permet de revenir à l'article précédent.",
        immediate: false,
        positive: true,
    },
    Mine: {
        definition:
            "Piège un article (sauf une page objectif) et fait reculer un adversaire de 5 articles s’il tombe dans l’explosion. Choisissez votre article cible.",
        immediate: false,
        positive: true,
    },
    Teleporteur: {
        definition: "Permet au joueur de se téléporter vers un article situé à distance 2 d’une page objectif.",
        immediate: true,
        positive: true,
    },
    Escargot: {
        definition: "Vous êtes condamné à rester au moins 1 minute sur cet article.",
        immediate: true,
        positive: false,
    },
    Gomme: {
        definition: "Vous venez de gommer le dernier objectif atteint, nécessitant de s’y rendre de nouveau.",
        immediate: true,
        positive: false,
    },
    Desorienteur: {
        definition: "Vous envoie aléatoirement vers n’importe quel article de Wikipédia. Bon voyage...",
        immediate: true,
        positive: false,
    },
    Dictateur: {
        definition: "Vous devez vous rendre impérativement vers {page_objectif} avant les prochains objectifs, ou il ne seront pas comptabilisés.",
        immediate: true,
        positive: false,
    },
};

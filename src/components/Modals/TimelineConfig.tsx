import * as React from "react";
import {IconBook, IconFlag, IconPackage, IconWorld} from "@tabler/icons-react";

export type TimelineType = "start" | "foundArtifact" | "usedArtifact" | "foundPage" | "visitedPage";

// --- Mapping de configuration de la timeline
export const timelineConfig: Record<
    TimelineType,
    {
        title: string;
        content: string | null;
        color: string;
        icon: React.ReactNode;
    }
> = {
    start: {
        title: "Début de la partie",
        content: null,
        color: "gray",
        icon: <IconFlag size={16} color="white" />,
    },
    foundArtifact: {
        title: "Artefact trouvé",
        content: "{user} a trouvé l'artefact {artefact}",
        color: "pink",
        icon: <IconPackage size={16} color="white" />,
    },
    usedArtifact: {
        title: "Artefact utilisé",
        content: "{user} a utilisé l'artefact {artefact}",
        color: "orange",
        icon: <IconPackage size={16} color="white" />,
    },
    foundPage: {
        title: "Page trouvée",
        content: "{user} a trouvé la page objectif {page_name}",
        color: "green",
        icon: <IconBook size={16} color="white" />,
    },
    visitedPage: {
        title: "Page visitée",
        content: "{user} a visité la page {page_name}",
        color: "blue",
        icon: <IconWorld size={16} color="white" />,
    },
};

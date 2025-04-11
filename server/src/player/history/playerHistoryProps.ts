export type HistoryType = "start" | "foundArtifact" | "usedArtifact" | "foundPage" | "visitedPage";

export interface HistoryStep {
    type: HistoryType;
    data?: Record<string, string>;
    date: Date;
}

export const historyConfig: Record<
    HistoryType,
    {
        title: string;
        getContent: (data?: Record<string, string>) => string;
    }
> = {
    start: {
        title: "Début de la partie",
        getContent: () => "La partie a commencé",
    },
    foundArtifact: {
        title: "Artefact trouvé",
        getContent: data => `${data?.player || ""} a trouvé l'artefact ${data?.artefact || ""}`,
    },
    usedArtifact: {
        title: "Artefact utilisé",
        getContent: data => `${data?.player || ""} a utilisé l'artefact ${data?.artefact || ""}`,
    },
    foundPage: {
        title: "Page trouvée",
        getContent: data => `${data?.player || ""} a trouvé la page objectif ${data?.page_name || ""}`,
    },
    visitedPage: {
        title: "Page visitée",
        getContent: data => `${data?.player || ""} a visité la page ${data?.page_name || ""}`,
    },
};

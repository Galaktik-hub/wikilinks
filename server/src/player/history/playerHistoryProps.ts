export type HistoryType = "start" | "foundArtifact" | "usedArtifact" | "foundPage" | "visitedPage" | "artifactEffect";

export interface HistoryStep {
    type: HistoryType;
    data?: Record<string, string>;
    id: Date;
}

export type HistoryType = "start" | "foundArtifact" | "usedArtifact" | "foundPage" | "visitedPage";

export interface HistoryStep {
    type: HistoryType;
    data?: Record<string, string>;
    id: Date;
}

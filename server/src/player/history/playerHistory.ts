import {HistoryStep, HistoryType} from "./playerHistoryProps";

export class PlayerHistory {
    private steps: HistoryStep[] = [];

    // Ajoute une étape à l'historique, en injectant automatiquement le nom du joueur dans les données
    addStep(type: HistoryType, data?: Record<string, string>): void {
        const step: HistoryStep = {
            type,
            data: {...data},
            id: new Date(),
        };
        this.steps.push(step);
    }

    removeLastByType(type: HistoryType): number {
        const lastIdx = this.steps.map(step => step.type).lastIndexOf(type);
        if (lastIdx >= 0) {
            this.steps.splice(lastIdx, 1);
        }
        return lastIdx;
    }

    removeLastObjectiveStep(): void {
        this.removeLastByType("foundPage");
    }

    getHistory(): HistoryStep[] {
        return this.steps;
    }
}

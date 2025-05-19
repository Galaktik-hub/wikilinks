import {HistoryStep, HistoryType} from "./playerHistoryProps";
import {Player} from "../player";

export class PlayerHistory {
    private steps: HistoryStep[] = [];

    constructor(private player: Player) {
        // Enregistrement de l'action de démarrage dès la création de l'historique
        this.addStep("start");
    }

    // Ajoute une étape à l'historique, en injectant automatiquement le nom du joueur dans les données
    addStep(type: HistoryType, data?: Record<string, string>): void {
        const step: HistoryStep = {
            type,
            data: {...data},
            id: new Date(),
        };
        this.steps.push(step);
    }

    removeLastObjectiveStep(): void {
        const lastIdx = this.steps.map(step => step.type).lastIndexOf("foundPage");
        this.steps = this.steps.filter((_, i) => i !== lastIdx);
    }

    getHistory(): HistoryStep[] {
        return this.steps;
    }
}

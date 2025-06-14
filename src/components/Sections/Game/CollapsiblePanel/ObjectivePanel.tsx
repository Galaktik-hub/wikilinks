"use client";

import * as React from "react";
import ObjectiveItem from "./ObjectiveItem.tsx";
import CollapsiblePanel from "./CollapsiblePanel.tsx";
import {useEffect} from "react";
import {useGameContext} from "../../../../context/GameContext.tsx";
import {useChallengeContext} from "../../../../context/ChallengeContext";

interface Objective {
    id: string;
    text: string;
    isReached: boolean;
}

const ObjectivesPanel: React.FC = () => {
    const gameContext = useGameContext();
    const challengeContext = useChallengeContext();
    const [objectives, setObjectives] = React.useState<Objective[]>([]);

    const fetchObjectives = () => {
        if (challengeContext.sessionId !== "") {
            const targetObjective: Objective = {
                id: "target-objective",
                text: `Atteindre l'article ${challengeContext.targetArticle.replace(/_+/g, " ")}`,
                isReached: false,
            };
            setObjectives([targetObjective]);
        } else if (gameContext.articles && gameContext.articles.length > 0) {
            const updatedObjectives: Objective[] = [];
            gameContext.articles.forEach((article: {name: string; found: boolean}, index: number) => {
                updatedObjectives.push({
                    id: `objective-${index}`,
                    text: `${article.name.replace(/_+/g, " ")}`,
                    isReached: article.found,
                });
            });
            setObjectives(updatedObjectives);
        }
    };

    useEffect(() => {
        fetchObjectives();
    }, []);

    return (
        <CollapsiblePanel title="Objectifs" contentId="objectives-content">
            {objectives.map(objective => (
                <ObjectiveItem key={objective.id} text={objective.text} isReached={objective.isReached} />
            ))}
        </CollapsiblePanel>
    );
};

export default ObjectivesPanel;

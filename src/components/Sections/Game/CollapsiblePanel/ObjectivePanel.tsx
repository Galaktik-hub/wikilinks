"use client";

import * as React from "react";
import ObjectiveItem from "./ObjectiveItem.tsx";
import CollapsiblePanel from "./CollapsiblePanel.tsx";
import {useEffect} from "react";
import {useGameContext} from "../../../../context/GameContext.tsx";

interface Objective {
    id: string;
    text: string;
    isReached: boolean;
}

const ObjectivesPanel: React.FC = () => {
    const gameContext = useGameContext();
    const [objectives, setObjectives] = React.useState<Objective[]>([]);

    useEffect(() => {
        if (gameContext.articles) {
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
    }, [gameContext.articles]);

    return (
        <CollapsiblePanel title="Objectifs" contentId="objectives-content">
            {objectives.map(objective => (
                <ObjectiveItem key={objective.id} text={objective.text} isReached={objective.isReached} />
            ))}
        </CollapsiblePanel>
    );
};

export default ObjectivesPanel;

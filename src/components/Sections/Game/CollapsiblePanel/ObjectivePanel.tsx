"use client";

import * as React from "react";
import ObjectiveItem from "./ObjectiveItem.tsx";
import CollapsiblePanel from "./CollapsiblePanel.tsx";

interface Objective {
    id: string;
    text: string;
    isReached: boolean;
}

const ObjectivesPanel: React.FC = () => {
    const objectives: Objective[] = [
        { id: "obj1", text: "Title of the page reached", isReached: true },
        { id: "obj2", text: "Page title not reached", isReached: false },
        { id: "obj3", text: "Page title not reached", isReached: false },
    ];

    return (
        <CollapsiblePanel title="Objectifs" contentId="objectives-content">
            {objectives.map((objective) => (
                <ObjectiveItem
                    key={objective.id}
                    text={objective.text}
                    isReached={objective.isReached}
                />
            ))}
        </CollapsiblePanel>
    );
};

export default ObjectivesPanel;

"use client";

import * as React from "react";
import ObjectiveItem from "./ObjectiveItem.tsx";
import CollapsiblePanel from "./CollapsiblePanel.tsx";
import {useContext, useEffect} from "react";
import {SocketContext} from "../../../../context/SocketContext.tsx";

interface Objective {
    id: string;
    text: string;
    isReached: boolean;
}

const ObjectivesPanel: React.FC = () => {
    const socket = useContext(SocketContext);
    const [objectives, setObjectives] = React.useState<Objective[]>([]);

    useEffect(() => {
        if (socket?.articles) {
            const updatedObjectives: Objective[] = [];
            socket?.articles.forEach(
                (article: string, index: number) => {
                    updatedObjectives.push({
                        id: `objective-${index}`,
                        text: `${article}`,
                        isReached: false,
                    });
                }
            )
            setObjectives(updatedObjectives);
        }
    }, [socket?.articles]);

    return (
        <CollapsiblePanel title="Objectifs" contentId="objectives-content">
            {objectives.map(objective => (
                <ObjectiveItem key={objective.id} text={objective.text} isReached={objective.isReached} />
            ))}
        </CollapsiblePanel>
    );
};

export default ObjectivesPanel;

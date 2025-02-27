"use client";

import * as React from "react";
import { useState } from "react";
import ObjectiveItem from "./ObjectiveItem.tsx";
import UpSVG from "../../../assets/Game/UpSVG.tsx";
import Container from "../../Container.tsx";

interface Objective {
    id: string;
    text: string;
    isReached: boolean;
}

const ObjectivesPanel: React.FC = () => {
    const [isOpen, setIsOpen] = useState(true);

    const togglePanel = () => {
        setIsOpen(!isOpen);
    };

    // Sample objectives data
    const objectives: Objective[] = [
        {
            id: "obj1",
            text: "Title of the page reached",
            isReached: true,
        },
        {
            id: "obj2",
            text: "Page title not reached",
            isReached: false,
        },
        {
            id: "obj3",
            text: "Page title not reached",
            isReached: false,
        },
    ];

    return (
        <Container className="flex flex-col justify-center w-[360px]">
            <div className="flex gap-10 justify-between w-full">
                <button
                    onClick={togglePanel}
                    aria-expanded={isOpen}
                    aria-controls="objectives-content"
                    className="flex justify-between w-full"
                >
                    <h2
                        className="gap-2.5 self-stretch py-1 text-lg font-bold leading-none text-sky-500 whitespace-nowrap w-[95px]"
                        style={{ textShadow: "0px 0px 14px #0ea5e9"}}
                    >
                        Objectifs
                    </h2>
                    <span
                        className={`flex gap-2.5 min-h-[25px] transform ${isOpen ? "rotate-180" : "rotate-0"} transition-transform duration-[300ms] ease-in-out `}
                    >
                        <UpSVG />
                    </span>
                </button>
            </div>

            {isOpen && (
                <div
                    id="objectives-content"
                    className="flex flex-col items-center gap-2 self-center mt-2 w-full text-base text-white"
                >
                    {objectives.map((objective) => (
                        <ObjectiveItem
                            key={objective.id}
                            text={objective.text}
                            isReached={objective.isReached}
                        />
                    ))}
                </div>
            )}
        </Container>
    );
};

export default ObjectivesPanel;

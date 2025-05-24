"use client";
import React from "react";
import ArticleDisplay from "./ArticleDisplay.tsx";
import {preventCtrlF} from "../../../functions/preventCtrlF.ts";
import {useGameContext} from "../../../context/GameContext.tsx";

const WikiPagePanel = () => {
    preventCtrlF();

    const {artifactInfo} = useGameContext();
    const {hasArtifact, luckPercentage} = artifactInfo;
    const [showNotification, setShowNotification] = React.useState(hasArtifact);

    React.useEffect(() => {
        setShowNotification(hasArtifact);
    }, [hasArtifact]);

    const chancePercentage = luckPercentage !== null ? luckPercentage : 60;

    return (
        <div className="card-container flex flex-col justify-center xl-custom:mb-32 mb-12">
            <div className="flex justify-between items-center w-full">
                <h2 className="blue-title-effect">Page Wikipedia</h2>

                {showNotification && (
                    <div className="flex items-center bg-background text-white px-3 py-1 rounded-md my-2 w-fit">
                        <div className="border border-white text-white rounded-full w-5 h-5 flex items-center justify-center mr-2">!</div>
                        <div className="flex flex-col text-bluePrimary">
                            <p className="m-0 text-sm">Artefact disponible</p>
                            <p className="m-0 text-sm">Chance : {chancePercentage}%</p>
                        </div>
                    </div>
                )}
            </div>

            <div className="flex flex-col items-center gap-2 self-center mt-2 w-full text-base text-white">
                <ArticleDisplay className="w-full" />
            </div>
        </div>
    );
};

export default WikiPagePanel;

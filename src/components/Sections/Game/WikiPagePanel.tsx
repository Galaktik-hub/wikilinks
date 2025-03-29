"use client";

import * as React from "react";
import ArticleDisplay from "./ArticleDisplay.tsx";
import { WikiNavigationProvider } from "../../../context/WikiNavigationContext.tsx";
import { preventCtrlF } from "../../../functions/preventCtrlF.ts";

const ObjectivesPanel: React.FC = () => {
    preventCtrlF();
    return (
        <div className="card-container flex flex-col justify-center xl-custom:mb-32 mb-12">
            <div className="flex justify-start w-full">
                <h2 className="blue-title-effect">
                    Page Wikipedia
                </h2>
            </div>

            <WikiNavigationProvider className="flex flex-col items-center gap-2 self-center mt-2 w-full text-base text-white">
                <ArticleDisplay className="w-full" />
            </WikiNavigationProvider>
        </div>
    );
};

export default ObjectivesPanel;

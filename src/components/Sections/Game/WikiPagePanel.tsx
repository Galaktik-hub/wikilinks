"use client";

import * as React from "react";
import Container from "../../Container.tsx";
import ArticleDisplay from "./ArticleDisplay.tsx";
import { WikiNavigationProvider } from "../../../context/Game/WikiNavigationContext.tsx";
import { preventCtrlF } from "../../../functions/preventCtrlF.ts";

const ObjectivesPanel: React.FC = () => {
    preventCtrlF();
    return (
        <Container className="flex flex-col justify-center w-full xl-custom:mb-32 mb-12">
            <div className="flex gap-10 justify-between w-full">
                <h2
                    className="gap-2.5 self-stretch py-1 text-lg font-bold leading-none text-sky-500 whitespace-nowrap"
                    style={{ textShadow: "0px 0px 14px #0ea5e9"}}
                >
                    Page Wikipedia
                </h2>
            </div>

            <WikiNavigationProvider className="flex flex-col items-center gap-2 self-center mt-2 w-full text-base text-white">
                <ArticleDisplay className="w-full" />
            </WikiNavigationProvider>
        </Container>
    );
};

export default ObjectivesPanel;

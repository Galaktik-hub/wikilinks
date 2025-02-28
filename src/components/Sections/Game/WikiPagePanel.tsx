"use client";

import * as React from "react";
import Container from "../../Container.tsx";
import ArticleDisplay from "./ArticleDisplay.tsx";


const ObjectivesPanel: React.FC = () => {

    return (
        <Container className="flex flex-col justify-center w-[360px]">
            <div className="flex gap-10 justify-between w-full">
                <h2
                    className="gap-2.5 self-stretch py-1 text-lg font-bold leading-none text-sky-500 whitespace-nowrap"
                    style={{ textShadow: "0px 0px 14px #0ea5e9"}}
                >
                    Page Wikipedia
                </h2>
            </div>

            <div className="flex flex-col items-center gap-2 self-center mt-2 w-full text-base text-white">
                <ArticleDisplay title={"Paris"} className="w-full" />
            </div>
        </Container>
    );
};

export default ObjectivesPanel;

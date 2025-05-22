"use client";

import ArticleDisplay from "./ArticleDisplay.tsx";
import {preventCtrlF} from "../../../functions/preventCtrlF.ts";

const WikiPagePanel = () => {
    preventCtrlF();
    return (
        <div className="card-container flex flex-col justify-center xl-custom:mb-32 mb-12">
            <div className="flex justify-start w-full">
                <h2 className="blue-title-effect">Page Wikipedia</h2>
            </div>

            <div className="flex flex-col items-center gap-2 self-center mt-2 w-full text-base text-white">
                <ArticleDisplay className="w-full" />
            </div>
        </div>
    );
};

export default WikiPagePanel;

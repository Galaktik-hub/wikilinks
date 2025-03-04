"use client";

import * as React from "react";
import Container from "../../../Container.tsx";

export const TextLoungePanel: React.FC = () => {
    return (
        <Container className="min-w-[360px] flex flex-col justify-center items-center whitespace-nowrap h-full">
            <h2
                className="gap-2.5 py-1 text-lg font-bold leading-none text-sky-500 whitespace-nowrap"
                style={{ textShadow: "0px 0px 14px #0ea5e9"}}
            >
                Salon Textuel
            </h2>
            <div className="mt-4 w-full text-base leading-none text-white flex justify-center bg-[#181D25] rounded-lg h-full">

            </div>
        </Container>
    );
};

export default TextLoungePanel;

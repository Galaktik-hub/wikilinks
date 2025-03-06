"use client";

import * as React from "react";
import { useState } from "react";
import { useMediaQuery } from "react-responsive";
import Container from "../../../Container.tsx";
import UpSVG from "../../../../assets/Game/UpSVG.tsx";

interface CollapsiblePanelProps {
    title: string;
    children: React.ReactNode;
    contentId?: string;
    initialOpen?: boolean;
}

const CollapsiblePanel: React.FC<CollapsiblePanelProps> = ({ title, children, contentId, initialOpen = true }) => {
    const [isOpen, setIsOpen] = useState(initialOpen);
    const isMobile = useMediaQuery({ maxWidth: 767 });
    const panelIsOpen = isMobile ? isOpen : true;

    const togglePanel = () => {
        if (isMobile) setIsOpen(!isOpen);
    };

    return (
        <Container className="flex flex-col justify-center w-[360px]">
            {isMobile ? (
                <div className="flex gap-10 justify-between w-full">
                    <button
                        onClick={togglePanel}
                        aria-expanded={isOpen}
                        aria-controls={contentId}
                        className="flex justify-between w-full"
                    >
                        <h2
                            className="py-1 text-lg font-bold leading-none text-sky-500 whitespace-nowrap"
                            style={{ textShadow: "0px 0px 14px #0ea5e9" }}
                        >
                            {title}
                        </h2>
                        <span
                            className={`min-h-[25px] transform transition-transform duration-[300ms] ease-in-out ${
                                isOpen ? "rotate-180" : "rotate-0"
                            }`}
                        >
                            <UpSVG />
                        </span>
                    </button>
                </div>
            ) : (
                <div className="flex justify-center w-full">
                    <h2
                        className="py-1 text-lg font-bold text-sky-500 text-center whitespace-nowrap leading-none"
                        style={{ textShadow: "0px 0px 14px #0ea5e9" }}
                    >
                        {title}
                    </h2>
                </div>
            )}

            {panelIsOpen && (
                <div
                    id={contentId}
                    className="flex flex-col items-center gap-2 mt-2 w-full text-base text-white"
                >
                    {children}
                </div>
            )}
        </Container>
    );
};

export default CollapsiblePanel;

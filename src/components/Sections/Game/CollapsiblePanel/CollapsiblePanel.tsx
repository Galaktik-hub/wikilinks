"use client";

import * as React from "react";
import { useState } from "react";
import { useMediaQuery } from "react-responsive";
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
        <div className="card-container flex flex-col justify-center">
            {isMobile ? (
                <div className="flex gap-10 justify-between w-full">
                    <button
                        onClick={togglePanel}
                        aria-expanded={isOpen}
                        aria-controls={contentId}
                        className="flex justify-between w-full"
                    >
                        <h2 className="blue-title-effect">
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
                    <h2 className="blue-title-effect">
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
        </div>
    );
};

export default CollapsiblePanel;

import * as React from "react";

const PlaySVG: React.FC<{className?: string}> = ({className = "w-6 h-6 text-white"}) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="currentColor" viewBox="0 0 24 24">
            <path d="M5 3l14 9-14 9V3z" />
        </svg>
    );
};

export default PlaySVG;

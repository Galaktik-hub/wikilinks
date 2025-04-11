import React from "react";

interface DiceSVGProps {
    className?: string;
}

const DiceSVG: React.FC<DiceSVGProps> = ({className = ""}) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="46" height="36" fill="none" className={className} viewBox="0 0 46 36">
        <g id="Frame" clipPath="url(#clip0_313_425)">
            <path
                id="Vector"
                fill="#93C5FD"
                d="M19.829 2.412a5.063 5.063 0 0 0-7.158 0l-9.76 9.76a5.063 5.063 0 0 0 0 7.157l9.76 9.76a5.063 5.063 0 0 0 7.158 0l9.76-9.76a5.063 5.063 0 0 0 0-7.158zM14.562 15.75a1.688 1.688 0 1 1 3.376 0 1.688 1.688 0 0 1-3.375 0M7.25 14.063a1.687 1.687 0 1 1 0 3.374 1.687 1.687 0 0 1 0-3.375m9 12.375a1.687 1.687 0 1 1 0-3.375 1.687 1.687 0 0 1 0 3.375m9-12.375a1.687 1.687 0 1 1 0 3.374 1.687 1.687 0 0 1 0-3.375m-9-5.625a1.688 1.688 0 1 1 0-3.376 1.688 1.688 0 0 1 0 3.376M23 31.5c0 2.482 2.018 4.5 4.5 4.5H41c2.482 0 4.5-2.018 4.5-4.5V18c0-2.482-2.018-4.5-4.5-4.5h-8.037a7.31 7.31 0 0 1-1.786 7.418L23 29.095zm11.25-8.437a1.687 1.687 0 1 1 0 3.374 1.687 1.687 0 0 1 0-3.375"></path>
        </g>
        <defs>
            <clipPath id="clip0_313_425">
                <path fill="#fff" d="M.5 0h45v36H.5z"></path>
            </clipPath>
        </defs>
    </svg>
);

export default DiceSVG;

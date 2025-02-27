import React from "react";

interface StarSVGProps {
    className?: string;
}

const StarSVG: React.FC<StarSVGProps> = ({ className = "" }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="42"
        height="36"
        fill="none"
        className={className}
        viewBox="0 0 42 36"
    >
        <g clipPath="url(#clip0_313_415)">
            <g clipPath="url(#clip1_313_415)">
                <path
                    fill="#93C5FD"
                    d="M23.032 1.266a2.253 2.253 0 0 0-4.05 0l-4.521 9.302-10.097 1.49a2.25 2.25 0 0 0-1.807 1.526c-.26.809-.05 1.702.556 2.3l7.326 7.249-1.73 10.244a2.257 2.257 0 0 0 3.284 2.363l9.021-4.817 9.021 4.817c.76.4 1.68.344 2.377-.162a2.26 2.26 0 0 0 .907-2.2l-1.737-10.245 7.327-7.25c.604-.597.822-1.49.555-2.299a2.26 2.26 0 0 0-1.807-1.525l-10.104-1.491z"
                ></path>
            </g>
        </g>
        <defs>
            <clipPath id="clip0_313_415">
                <path fill="#fff" d="M.75 0h40.5v36H.75z"></path>
            </clipPath>
            <clipPath id="clip1_313_415">
                <path fill="#fff" d="M.75 0h40.5v36H.75z"></path>
            </clipPath>
        </defs>
    </svg>
);

export default StarSVG;

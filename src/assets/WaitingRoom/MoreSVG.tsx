"use client";

import * as React from "react";

const MoreSVG: React.FC<React.SVGProps<SVGSVGElement>> = (props) => {
    return (
        <svg
            width="25"
            height="25"
            viewBox="0 0 25 25"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <g filter="url(#filter0_d_386_348)">
                <path
                    d="M10.4165 12.5C10.4165 13.0526 10.636 13.5825 11.0267 13.9732C11.4174 14.3639 11.9473 14.5834 12.4998 14.5834C13.0524 14.5834 13.5823 14.3639 13.973 13.9732C14.3637 13.5825 14.5832 13.0526 14.5832 12.5C14.5832 11.9475 14.3637 11.4176 13.973 11.0269C13.5823 10.6362 13.0524 10.4167 12.4998 10.4167C11.9473 10.4167 11.4174 10.6362 11.0267 11.0269C10.636 11.4176 10.4165 11.9475 10.4165 12.5ZM10.4165 6.25002C10.4165 6.80255 10.636 7.33246 11.0267 7.72316C11.4174 8.11386 11.9473 8.33335 12.4998 8.33335C13.0524 8.33335 13.5823 8.11386 13.973 7.72316C14.3637 7.33246 14.5832 6.80255 14.5832 6.25002C14.5832 5.69749 14.3637 5.16758 13.973 4.77688C13.5823 4.38618 13.0524 4.16669 12.4998 4.16669C11.9473 4.16669 11.4174 4.38618 11.0267 4.77688C10.636 5.16758 10.4165 5.69749 10.4165 6.25002ZM10.4165 18.75C10.4165 19.3026 10.636 19.8325 11.0267 20.2232C11.4174 20.6139 11.9473 20.8334 12.4998 20.8334C13.0524 20.8334 13.5823 20.6139 13.973 20.2232C14.3637 19.8325 14.5832 19.3026 14.5832 18.75C14.5832 18.1975 14.3637 17.6676 13.973 17.2769C13.5823 16.8862 13.0524 16.6667 12.4998 16.6667C11.9473 16.6667 11.4174 16.8862 11.0267 17.2769C10.636 17.6676 10.4165 18.1975 10.4165 18.75Z"
                    fill="#9CA3AF"
                />
            </g>
            <defs>
                <filter
                    id="filter0_d_386_348"
                    x="-4"
                    y="0"
                    width="33"
                    height="33"
                    filterUnits="userSpaceOnUse"
                    colorInterpolationFilters="sRGB"
                >
                    <feFlood floodOpacity="0" result="BackgroundImageFix" />
                    <feColorMatrix
                        in="SourceAlpha"
                        type="matrix"
                        values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                        result="hardAlpha"
                    />
                    <feOffset dy="4" />
                    <feGaussianBlur stdDeviation="2" />
                    <feComposite in2="hardAlpha" operator="out" />
                    <feColorMatrix
                        type="matrix"
                        values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
                    />
                    <feBlend
                        mode="normal"
                        in2="BackgroundImageFix"
                        result="effect1_dropShadow_386_348"
                    />
                    <feBlend
                        mode="normal"
                        in="SourceGraphic"
                        in2="effect1_dropShadow_386_348"
                        result="shape"
                    />
                </filter>
            </defs>
        </svg>
    );
};

export default MoreSVG;

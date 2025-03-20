import React from "react";

interface ExcludeSVGProps {
    className?: string;
}

const ExcludeSVG: React.FC<ExcludeSVGProps> = ({ className = "" }) => (
    <svg
        width="26"
        height="20"
        viewBox="0 0 26 20"
        fill="none"
        className={className}
        xmlns="http://www.w3.org/2000/svg">
        <g clipPath="url(#clip0_353_520)">
            <path d="M1.51584 0.199438C1.10959 -0.120874 0.519751 -0.0466554 0.199438 0.359595C-0.120874 0.765845 -0.0466554 1.35569 0.359595 1.676L23.4846 19.801C23.8908 20.1213 24.4807 20.0471 24.801 19.6408C25.1213 19.2346 25.0471 18.6448 24.6408 18.3244L13.801 9.82834C15.9338 9.25803 17.5002 7.31272 17.5002 5.00022C17.5002 2.2385 15.2619 0.00021957 12.5002 0.00021957C9.77366 0.00021957 7.55881 2.17991 7.50022 4.89084L1.51584 0.199438ZM10.3244 11.8869C6.66038 12.0862 3.75022 15.1252 3.75022 18.8401C3.75022 19.4807 4.26975 20.0002 4.91038 20.0002H20.0901C20.2424 20.0002 20.3869 19.9729 20.5198 19.9182L10.3244 11.8869Z" fill="#EF4444"/>
        </g>
        <defs>
            <clipPath id="clip0_353_520">
                <path d="M0.5 0H25.5V20H0.5V0Z" fill="white"/>
            </clipPath>
        </defs>
    </svg>

);

export default ExcludeSVG;

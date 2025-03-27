import * as React from "react";

interface PodiumPositionProps {
    playerNumber: string;
    position: string;
    heightClass: string;
    playerIconSize: string;
    textColorClass: string;
}

export const PodiumPosition: React.FC<PodiumPositionProps> = ({
                                                                  playerNumber,
                                                                  position,
                                                                  heightClass,
                                                                  playerIconSize,
                                                                  textColorClass,
                                                              }) => {
    return (
        <figure className="flex flex-col justify-center w-16">
            <figcaption
                className={`flex justify-center items-center ${playerIconSize} leading-none text-white rounded-full`}
            >
                {playerNumber}
            </figcaption>
            <div
                className={`flex justify-center items-center w-full text-center ${textColorClass} whitespace-nowrap bg-gray-700 rounded-lg ${heightClass}`}
            >
                <span className="self-stretch my-auto w-5">{position}</span>
            </div>
        </figure>
    );
};

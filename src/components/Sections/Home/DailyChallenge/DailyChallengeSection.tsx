import React from 'react';
import {useMediaQuery} from 'react-responsive';
import {Timer} from './Timer';
import {PlayButton} from './PlayButton';
import {PlayerCount} from './PlayerCount';
import AndroidSVG from '../../../../assets/Home/AndroidSVG.tsx';

interface DailyChallengeSectionProps {
    title: string;
    playerCount: number;
}

const DailyChallengeSection: React.FC<DailyChallengeSectionProps> = ({
                                                                         title,
                                                                         playerCount
                                                                     }) => {
    const isMobile = useMediaQuery({maxWidth: 767});

    if (isMobile) {
        // Display the daily challenge for mobile
        return (
            <div
                className="font-inter bg-gradient-to-br from-[#EA580C] to-[#DC2626] rounded-2xl p-6 text-white flex flex-col gap-4 w-[90%] md:w-[600px] mx-auto my-8">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl md:text-2xl font-bold">Défi du jour</h2>
                    <Timer/>
                </div>
                <h2 className="text-2xl md:text-3xl text-center my-4">{title}</h2>
                <PlayerCount count={playerCount}/>
                <PlayButton onClick={() => {
                    console.log("Daily challenge clicked");
                }}/>
            </div>
        );
    } else {
        // Display the publicite for desktop
        return (
            <div
                className="font-inter bg-gradient-to-br from-[#EA580C] to-[#DC2626] rounded-2xl p-8 text-white w-[90%] md:w-[800px] lg:w-[900px] mx-auto my-8 relative overflow-hidden">
                <div className="flex flex-row justify-between items-center z-10 relative">
                    <div className="flex flex-col gap-3 max-w-[60%]">
                        <h2 className="font-inter text-2xl md:text-3xl font-bold">Découvrez les défis quotidiens</h2>
                        <p className="font-inter font-light text-base md:text-lg">Affrontez les joueurs du monde entier à travers des défis
                            quotidiens basés sur votre position !</p>

                        <div className="mt-2">
                            <PlayerCount count={playerCount}/>
                        </div>
                    </div>

                    <div className="flex items-center justify-center">
                        <a className="font-righteous text-xl cursor-pointer inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#10B981] rounded-full text-white font-normal hover:bg-[#0D9668] transition-colors min-w-[180px]"
                           onClick={() => {
                               console.log("Download clicked");
                           }}>
                            <AndroidSVG className="w-6 h-6"/>
                            Télécharger
                        </a>
                    </div>
                </div>

                <div className="absolute bottom-3 right-4 transform -rotate-2 translate-x-4 translate-y-4 opacity-90">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="159"
                        height="189"
                        fill="none"
                        viewBox="0 0 159 189"
                    >
                        <g clipPath="url(#clip0_407_9)">
                            <path
                                fill="#FFAC33"
                                d="m34.761 107.34 24.031-16.827c4.422-3.096 7.226-5.68 10.322-1.259l-5.609-8.01C60.41 76.822 54.8 75.4 50.38 78.497l-32.042 22.436c-8.01 5.609-8.39 18.559 2.007 28.439 0 0 33.465 32.526 35.605 34.508 5.658 5.242 17.038 6.227 24.716.851l27.868-19.514c4.426-3.099-5.473-7.484-8.57-11.906l-5.608-8.01c3.096 4.421 2.512 10.178-1.91 13.274l-16.02 11.218c-4.422 3.096-10.264.967-13.62-2.402-3.355-3.368-26.909-24.927-26.909-24.927-6.71-6.744-5.56-12.025-1.135-15.124m103.382-72.39-24.031 16.828c-4.422 3.096-12.047 7.814-8.951 12.236l-5.609-8.01c-3.096-4.422 1.725-13.146 6.146-16.242l32.042-22.436c8.01-5.609 20.314-1.54 26.038 11.613 0 0 19.874 42.304 20.951 45.018 2.789 7.001.235 17.743-7.607 23.234l-28.621 20.041c-4.422 3.096-9.395-4.739-12.491-9.161l-5.609-8.01c3.096 4.421 12.943 2.875 17.364-.221l16.021-11.218c4.422-3.096 4.423-9.317 2.402-13.62S151.967 41.19 151.967 41.19c-4.047-8.609-9.398-9.338-13.824-6.24m7.211 96.422c-19.513-27.868-10.85 7.598-10.85 7.598s-31.529-19.455-12.015 8.413 14.863 49.281 14.863 49.281l49.232-34.472c-.004.003-21.716-2.951-41.23-30.82"
                            ></path>
                            <path
                                fill="#FFCC4D"
                                d="M135.308 46.349c19 27.135 23.904 91.848 6.962 103.711s-76.076-14.878-95.076-42.013c-14.57-20.807-13.716-28.113-5.706-33.722C46.991 70.47 65.544 57.32 73.454 51.78l28.033-19.635c11.681-8.185 17.939-8.479 33.821 14.203"
                            ></path>
                            <path
                                fill="#C1694F"
                                d="M200.907 158.132c3.096 4.421 6.518 7.373 2.097 10.469l-64.083 44.872c-4.426 3.099-7.011-.439-10.107-4.861l-2.804-4.005c-3.097-4.422-.947-11.275 3.226-14.197l55.74-39.03c4.174-2.922 10.031-1.675 13.127 2.746z"
                            ></path>
                            <path
                                fill="#C1694F"
                                d="M213.475 159.031c2.131 3.044 4.517 5.044-1.158 9.018l-77.1 53.986c-5.175 3.624-7.725 1.738-9.856-1.306l-.701-1.001c-2.132-3.044-.9-7.577 2.143-9.708l77.1-53.986c3.04-2.129 6.739-1.048 8.871 1.996z"
                            ></path>
                        </g>
                        <defs>
                            <clipPath id="clip0_407_9">
                                <path
                                    fill="#fff"
                                    d="M.22 101.681 144.407.721l100.96 144.186-144.186 100.96z"
                                ></path>
                            </clipPath>
                        </defs>
                    </svg>
                </div>
            </div>
        );
    }
};

export default DailyChallengeSection;

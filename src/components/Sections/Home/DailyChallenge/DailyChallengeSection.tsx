import React from 'react';
import {useMediaQuery} from 'react-responsive';
import {Timer} from './Timer';
import {PlayButton} from './PlayButton';
import {PlayerCount} from './PlayerCount';
import AndroidSVG from '../../../../assets/Home/AndroidSVG.tsx';
import TrophySVG from "../../../../assets/Home/TrophySVG.tsx";

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
                className="font-inter bg-gradient-to-br from-[#EA580C] to-[#DC2626] rounded-2xl p-8 text-white mx-2.5 my-8 relative overflow-hidden">
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
                    <TrophySVG />
                </div>
            </div>
        );
    }
};

export default DailyChallengeSection;

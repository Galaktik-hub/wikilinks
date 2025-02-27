import React from 'react';
import { Timer } from './Timer';
import { PlayButton } from './PlayButton';
import { PlayerCount } from './PlayerCount';

interface DailyChallengeSectionProps {
    title: string;
    playerCount: number;
}

const DailyChallengeSection: React.FC<DailyChallengeSectionProps> = ({
    title,
    playerCount
}) => {
    return (
        <div className="font-inter bg-gradient-to-br from-[#EA580C] to-[#DC2626] rounded-2xl p-6 text-white flex flex-col gap-4 w-[90%] md:w-[600px] mx-auto my-8">
            <div className="flex justify-between items-center">
                <h2 className="text-xl md:text-2xl font-bold">Défi du jour</h2>
                <Timer />
            </div>
            <h2 className="text-2xl md:text-3xl text-center my-4">{title}</h2>
            <PlayerCount count={playerCount} />
            <PlayButton onClick={() => { console.log("Daily challenge clicked"); }} />
        </div>
    );
};

export default DailyChallengeSection;

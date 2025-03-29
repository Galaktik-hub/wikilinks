import React from "react";
import {ResultProps} from "../../../../pages/Result/Result.tsx";

interface PodiumProps {
    players: ResultProps[];
}

interface ConfigItem {
    label: string;
    nameClass: string;
    rankClass: string;
    rankTextClass: string;
}

const Podium: React.FC<PodiumProps> = ({ players }) => {
    // Configuration spécifique pour 1, 2 ou 3 joueurs
    const podiumConfig: { [key: number]: ConfigItem[] } = {
        1: [
            { label: '1er', nameClass: 'min-h-16', rankClass: 'min-h-24', rankTextClass: 'text-amber-400' },
        ],
        2: [
            { label: '1er', nameClass: 'min-h-16', rankClass: 'min-h-24', rankTextClass: 'text-amber-400' },
            { label: '2e', nameClass: 'min-h-12', rankClass: 'min-h-20', rankTextClass: 'text-gray-400' },
        ],
        3: [
            { label: '2e', nameClass: 'min-h-12', rankClass: 'min-h-20', rankTextClass: 'text-gray-400' },
            { label: '1er', nameClass: 'min-h-16', rankClass: 'min-h-24', rankTextClass: 'text-amber-400' },
            { label: '3e', nameClass: 'min-h-12', rankClass: 'min-h-16', rankTextClass: 'text-amber-600' },
        ],
    };

    const config = podiumConfig[players.length];
    const containerClass =
        players.length === 1
            ? 'flex justify-center w-full'
            : 'flex flex-1 shrink gap-10 justify-between items-end w-full';

    return (
        <div className="card-container flex flex-col gap-2 justify-center">
            <div className="flex justify-center w-full">
                <h2 className="blue-title-effect">Podium</h2>
            </div>
            <div className={containerClass}>
                {players.map((player, idx) => (
                    <aside key={player.rank} className="flex flex-col justify-center items-center w-full max-w-[200px]">
                        <div className={`flex justify-center items-center w-full ${config[idx].nameClass} text-white rounded-full`}>
                            <p className="text-lg text-center">{player.name}</p>
                        </div>
                        <div className={`flex justify-center items-center w-full ${config[idx].rankClass} text-center bg-gray-700 rounded-t-lg`}>
                            <p className={`text-lg text-center ${config[idx].rankTextClass}`}>{config[idx].label}</p>
                        </div>
                    </aside>
                ))}
            </div>
        </div>
    );
};

export default Podium;

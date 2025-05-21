"use client";
import * as React from "react";
import {useModalContext} from "../../../Modals/ModalProvider.tsx";
import {TimelineStep} from "./PlayerProgressPanel.tsx";

interface PlayerProgressBarProps {
    playerName: string;
    percentage: number;
    history: TimelineStep[];
}

const PlayerProgressItem: React.FC<PlayerProgressBarProps> = ({playerName, percentage, history}) => {
    const normalizedPercentage = Math.min(Math.max(percentage, 0), 100);
    const progressWidth = `${normalizedPercentage}%`;
    const {openModal, closeModal} = useModalContext();

    const handleClick = () => {
        openModal({
            title: `Historique de ${playerName}`,
            type: "timeline",
            content: {
                username: playerName,
                timelineSteps: history,
                cancelButton: {label: "Fermer", onClick: () => closeModal()},
            },
        });
    };

    return (
        <button onClick={handleClick} className="w-full">
            <div className="flex gap-10 justify-between items-center py-1 w-full ">
                <div className="flex gap-2.5 items-center self-stretch my-auto">
                    <h3 className="self-stretch my-auto text-base leading-none text-white">{playerName}</h3>
                    <div className="self-stretch my-auto text-xs font-light leading-none underline text-zinc-400 w-[54px]">Détails</div>
                </div>
                <p className="self-stretch my-auto text-base leading-none text-white">{normalizedPercentage}%</p>
            </div>
            <div className="flex flex-col items-start mt-1.5 w-full bg-gray-700 rounded-full">
                <div className="flex bg-emerald-500 rounded-full min-h-2" style={{width: progressWidth}} />
            </div>
        </button>
    );
};

export default PlayerProgressItem;

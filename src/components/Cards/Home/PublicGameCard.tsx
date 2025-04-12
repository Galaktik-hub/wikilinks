"use client";
import React from "react";
import {useMediaQuery} from "react-responsive";
import CopySVG from "../../../assets/Home/CopySVG.tsx";
import PlayerCountBadge from "./PlayerCountBadge.tsx";
import {usePopup} from "../../../context/PopupContext.tsx";

interface PublicGameCardProps {
    hostName: string;
    playerCount: number;
    maxPlayers: number;
    gameCode: string;
    onJoin: () => void;
}

export const PublicGameCard: React.FC<PublicGameCardProps> = ({hostName, playerCount, maxPlayers, gameCode, onJoin}) => {
    const isMobile = useMediaQuery({maxWidth: 767});
    const {showPopup} = usePopup();

    const handleCopy = async (gameCode: string) => {
        try {
            await navigator.clipboard.writeText(gameCode);
            showPopup("info", "Lien copié");
        } catch (err) {
            showPopup("error", "Échec de la copie");
            console.error("Échec de la copie :", err);
        }
    }

    if (isMobile) {
        return (
            <article className="flex flex-col justify-center items-center shrink p-4 bg-bgSecondary rounded-xl gap-4 min-w-60 w-[360px]">
                <div className="flex gap-10 justify-between items-center w-full text-white">
                    <h3 className="self-stretch my-auto text-base font-bold leading-none w-[125px]">Partie de {hostName}</h3>
                    <PlayerCountBadge playerCount={playerCount} maxPlayers={maxPlayers} />
                </div>
                <div className="flex items-center gap-5 py-0.5 w-full">
                    <div className="flex gap-2 items-center h-full">
                        <p className="self-stretch my-auto text-sm text-gray-400">Code : {gameCode}</p>
                        <button
                            onClick={() => handleCopy(gameCode)}
                            className="flex overflow-hidden justify-center items-center self-stretch my-auto w-4 min-h-4">
                            <CopySVG />
                        </button>
                    </div>
                </div>
                <button
                    onClick={onJoin}
                    className="flex-1 shrink w-full gap-2.5 py-2.5 my-auto text-base text-center text-white whitespace-nowrap bg-blueSecondary hover:bg-blue-900 transition rounded-lg basis-0">
                    Rejoindre
                </button>
            </article>
        );
    } else {
        return (
            <article className="flex flex-col justify-center items-center gap-2.5 shrink p-4 bg-bgSecondary rounded-xl min-w-60 w-[300px]">
                <div className="flex gap-10 justify-between items-center w-full text-white">
                    <h3 className="self-stretch my-auto text-base font-bold leading-none w-[125px]">Partie de {hostName}</h3>
                    <PlayerCountBadge playerCount={playerCount} maxPlayers={maxPlayers} />
                </div>
                <div className="flex items-center gap-5 py-0.5 w-full">
                    <div className="flex gap-2 items-center h-full">
                        <p className="self-stretch my-auto text-sm text-gray-400">Code : {gameCode}</p>
                        <button
                            onClick={() => handleCopy(gameCode)}
                            className="flex overflow-hidden justify-center items-center self-stretch my-auto w-4 min-h-4">
                            <CopySVG />
                        </button>
                    </div>
                    <button
                        onClick={onJoin}
                        className="flex-1 shrink gap-2.5 py-2.5 my-auto text-base text-center text-white whitespace-nowrap bg-blueSecondary hover:bg-blue-900 transition rounded-lg basis-0">
                        Rejoindre
                    </button>
                </div>
            </article>
        );
    }
};

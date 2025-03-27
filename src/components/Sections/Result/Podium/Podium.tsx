import React from "react";
import {ResultProps} from "../../../../pages/Result/Result.tsx";

interface PodiumProps {
    players: ResultProps[];
}

const Podium: React.FC<PodiumProps> = ({ players }) => {
    return (
        <div className="flex flex-col gap-2 justify-center p-5 bg-gray-800 rounded-lg border-2 border-blue-700">
            <div className="flex justify-center w-full">
                <h2
                    className="py-1 text-lg font-bold leading-none text-sky-500 whitespace-nowrap"
                    style={{ textShadow: "0px 0px 14px #0ea5e9" }}
                >
                    Podium
                </h2>
            </div>
            <div className="flex flex-1 shrink gap-10 justify-between items-end w-full">
                {/* 2e place */}
                <aside className="flex flex-col justify-center items-center w-full">
                    <div className="flex justify-center items-center w-full min-h-12 text-white rounded-full">
                        <p className="text-lg text-center">{players[1].name}</p>
                    </div>
                    <div className="flex justify-center items-center w-full text-center text-gray-400 bg-gray-700 rounded-t-lg min-h-20">
                        <p className="text-lg text-center">2e</p>
                    </div>
                </aside>
                {/* 1er place */}
                <aside className="flex flex-col justify-center items-center w-full">
                    <div className="flex justify-center items-center w-full min-h-16 text-white rounded-full">
                        <p className="text-lg text-center">{players[0].name}</p>
                    </div>
                    <div className="flex justify-center items-center w-full text-center text-amber-400 bg-gray-700 rounded-t-lg min-h-24">
                        <p className="text-lg text-center">1er</p>
                    </div>
                </aside>
                {/* 3e place uniquement si dispo */}
                {players.length === 3 && (
                    <aside className="flex flex-col justify-center items-center w-full">
                        <div className="flex justify-center items-center w-full min-h-12 text-white rounded-full">
                            <p className="text-lg text-center">{players[2].name}</p>
                        </div>
                        <div className="flex justify-center items-center w-full text-center text-amber-600 bg-gray-700 rounded-t-lg min-h-16">
                            <p className="text-lg text-center">3e</p>
                        </div>
                    </aside>
                )}
            </div>
        </div>
    );
};

export default Podium;

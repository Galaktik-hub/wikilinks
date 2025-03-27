import React from "react";
import {ResultProps} from "../../../../pages/Result/Result.tsx";

interface PodiumProps {
    players: ResultProps[];
}

const Podium: React.FC<PodiumProps> = ({ players }) => {
    return (
        <div className="flex gap-2 justify-center items-end p-5 bg-gray-800 rounded-lg border-2 border-blue-700">
            <div className="flex flex-1 shrink gap-10 justify-between items-end px-6 w-full">
                {/* 2e place */}
                <aside className="flex flex-col justify-center w-16">
                    <div className="flex justify-center items-center w-16 min-h-12 text-white rounded-full">
                        {players[1].name}
                    </div>
                    <div className="flex justify-center items-center w-full text-center text-gray-400 bg-gray-700 rounded-lg min-h-20">
                        2e
                    </div>
                </aside>
                {/* 1er place */}
                <aside className="flex flex-col justify-center w-16">
                    <div className="flex justify-center items-center w-16 min-h-16 text-white rounded-full">
                        {players[0].name}
                    </div>
                    <div className="flex justify-center items-center w-full text-center text-amber-400 bg-gray-700 rounded-lg min-h-24">
                        1er
                    </div>
                </aside>
                {/* 3e place uniquement si dispo */}
                {players.length === 3 && (
                    <aside className="flex flex-col justify-center w-16">
                        <div className="flex justify-center items-center w-16 min-h-12 text-white rounded-full">
                            {players[2].name}
                        </div>
                        <div className="flex justify-center items-center w-full text-center text-amber-600 bg-gray-700 rounded-lg min-h-16">
                            3e
                        </div>
                    </aside>
                )}
            </div>
        </div>
    );
};

export default Podium;

"use client";
import * as React from "react";
import LeaderboardRow from "./LeaderBoardRow";
import {ResultProps} from "../../../../pages/Result/Result.tsx";

interface LeaderboardProps {
    players: ResultProps[];
    showCourse: boolean;
}

const Leaderboard: React.FC<LeaderboardProps> = ({players, showCourse}) => {
    const handleShowCourse = () => {
        console.log("show course");
    };

    return (
        <div className="card-container">
            <div className="flex justify-between text-center border-b-2 border-gray-700 my-2">
                <div className="flex-1 py-2 text-center blue-title-effect">Rang</div>
                <div className="flex-1 py-2 text-center blue-title-effect">Joueur</div>
                <div className="flex-1 py-2 text-center blue-title-effect">Score</div>
                {showCourse && <div className="flex-1 py-2 text-center blue-title-effect">Parcours</div>}
            </div>
            <div className="flex flex-col">
                {players.map(player => (
                    <LeaderboardRow
                        key={player.rank}
                        rank={player.rank}
                        name={player.name}
                        score={player.score}
                        showCourse={showCourse}
                        onViewCourse={handleShowCourse}
                    />
                ))}
            </div>
        </div>
    );
};

export default Leaderboard;
